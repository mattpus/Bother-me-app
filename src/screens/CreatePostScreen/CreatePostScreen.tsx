import {View, Text, Image, StyleSheet, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CreateNavigationProp, CreateRouteProp} from '../../types/navigation';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import {createPost} from './queries';
import {useMutation} from '@apollo/client';
import {CreatePostMutation, CreatePostMutationVariables} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';
import Carousel from '../../components/Carousel';
import VideoPlayer from '../../components/VideoPlayer';

const CreatePostScreen = () => {
  const [description, setDescription] = useState('');
  const {userId} = useAuthContext();

  const [doCreatePost] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost);

  const navigation = useNavigation<CreateNavigationProp>();
  const route = useRoute<CreateRouteProp>();
  const {image, images, video} = route.params;

  let content;
  if (image) {
    content = (
      <Image
        source={{
          uri: image,
        }}
        style={styles.image}
      />
    );
  } else if (images) {
    content = <Carousel images={images} />;
  } else if (video) {
    content = <VideoPlayer uri={video} />;
  }

  const submit = async () => {
    try {
      const response = await doCreatePost({
        variables: {
          input: {
            type: 'POST',
            description,
            image: image,
            images: images,
            video: video,
            nofComments: 0,
            nofLikes: 0,
            userID: userId,
          },
        },
      });
      console.log(response);

      navigation.popToTop();
      navigation.navigate('HomeStack');
    } catch (e) {
      Alert.alert('Error uploading the post', (e as Error).message);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>{content}</View>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description..."
        style={styles.input}
        multiline
        numberOfLines={5}
      />

      <Button text="Submit" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    marginVertical: 10,
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
  },
  content: {
    width: '100%',
    aspectRatio: 1,
  },
});

export default CreatePostScreen;

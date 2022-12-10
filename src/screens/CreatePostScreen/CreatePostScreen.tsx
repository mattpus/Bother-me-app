import {View, Image, StyleSheet, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CreateRouteProp} from '../../types/navigation';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import {createPost} from './queries';
import {useMutation} from '@apollo/client';
import {
  CreatePostInput,
  CreatePostMutation,
  CreatePostMutationVariables,
} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';
import Carousel from '../../components/Carousel';
import VideoPlayer from '../../components/VideoPlayer';
import {Storage} from 'aws-amplify';
import {v4 as uuid} from 'uuid';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const CreatePostScreen = () => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {userId} = useAuthContext();

  const [doCreatePost] = useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(createPost);

  const navigation = useNavigation<any>();
  const route = useRoute<CreateRouteProp>();
  const {image, images, video} = route.params;

  let content;
  if (image) {
    content = (
      <Image
        source={{
          uri: image,
        }}
        resizeMode="cover"
        style={styles.image}
      />
    );
  } else if (images) {
    content = <Carousel images={images} />;
  } else if (video) {
    content = <VideoPlayer uri={video} />;
  }

  const uploadMedia = async (uri: string) => {
    try {
      const response = await fetch(uri);

      const blob = await response.blob();
      const uriParts = uri.split('.');
      const extension = uriParts[uriParts.length - 1];
      const s3Response = await Storage.put(`${uuid()}.${extension}`, blob);

      console.log(s3Response.key);
      return s3Response.key;
    } catch (err) {
      Alert.alert((err as Error).message);
    }
  };

  const submit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    const input: CreatePostInput = {
      type: 'POST',
      description,
      image: undefined,
      images: undefined,
      video: undefined,
      nofComments: 0,
      nofLikes: 0,
      userID: userId,
    };
    //upload the image to the database
    if (image) {
      const imageKey = await uploadMedia(image);
      input.image = imageKey;
    }
    try {
      await doCreatePost({
        variables: {
          input,
        },
      });

      setIsSubmitting(false);
      navigation.popToTop();
      navigation.navigate('HomeStack');
    } catch (e) {
      Alert.alert('Error uploading the post', (e as Error).message);
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.root}>
      <View style={styles.content}>{content}</View>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description..."
        style={styles.input}
        multiline
        numberOfLines={5}
      />

      <Button
        text={isSubmitting ? 'Submitting...' : 'Submit'}
        onPress={submit}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
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

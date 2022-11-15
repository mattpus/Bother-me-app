import {Alert, StyleSheet, Text} from 'react-native';
import React from 'react';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import Entypo from 'react-native-vector-icons/Entypo';
import {useMutation} from '@apollo/client';
import {deletePost} from './queries';
import {
  DeleteCommentMutationVariables,
  DeletePostMutation,
  Post,
} from '../../API';
import {useAuthContext} from '../../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {FeedNavigationProp} from '../../types/navigation';

interface IPostMenu {
  post: Post;
}

const PostMenu = ({post}: IPostMenu) => {
  const [doDeletePost] = useMutation<
    DeletePostMutation,
    DeleteCommentMutationVariables
  >(deletePost, {variables: {input: {id: post.id, _version: post._version}}});

  const navigation = useNavigation<FeedNavigationProp>();
  const {userId} = useAuthContext();
  const isMyPost = userId === post.userID;

  const startDeletingPost = async () => {
    try {
      await doDeletePost();
    } catch (e) {
      Alert.alert('Failed to delete post', (e as Error).message);
    }
  };
  const onDeleteOptionPressed = () => {
    Alert.alert('Are you sure?', 'Deleting a post is permanent', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete post',
        style: 'destructive',
        onPress: startDeletingPost,
      },
    ]);
  };

  const onEditOptionPressed = () => {
    navigation.navigate('UpdatePost', {id: post.id});
  };

  return (
    <Menu renderer={renderers.SlideInMenu} style={styles.threeDots}>
      <MenuTrigger>
        <Entypo name="dots-three-horizontal" size={16} />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => Alert.alert('Reporting')}>
          <Text style={styles.optionText}>Report</Text>
        </MenuOption>
        {isMyPost && (
          <>
            <MenuOption onSelect={onDeleteOptionPressed}>
              <Text style={[styles.optionText, {color: 'red'}]}>Delete</Text>
            </MenuOption>
            <MenuOption onSelect={onEditOptionPressed}>
              <Text style={styles.optionText}>Edit</Text>
            </MenuOption>
          </>
        )}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  threeDots: {
    marginLeft: 'auto',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
  },
});

export default PostMenu;

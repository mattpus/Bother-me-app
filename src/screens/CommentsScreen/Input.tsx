import {useState} from 'react';
import {View, Text, Image, TextInput, StyleSheet, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useCommentsService from '../../services/CommentsService';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';

interface IInput {
  postId: string;
}

const Input = ({postId}: IInput) => {
  const [newComment, setNewComment] = useState('');

  const insets = useSafeAreaInsets();

  const {onCreateComment} = useCommentsService(postId);

  const onPost = async () => {
    onCreateComment(newComment);

    setNewComment('');
  };

  return (
    <View style={[styles.root, {paddingBottom: insets.bottom}]}>
      <Image
        source={{
          uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/2.jpg',
        }}
        style={styles.image}
      />
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Write your comment..."
        style={styles.input}
        multiline
      />

      <Text
        onPress={onPost}
        style={[styles.button, {bottom: insets.bottom + 7}]}>
        POST
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: 5,
    borderTopWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-end',
  },
  image: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  input: {
    flex: 1,

    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 25,

    paddingVertical: 5,
    paddingRight: 50,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  button: {
    position: 'absolute',
    right: 15,
    fontSize: fonts.size.s,
    fontWeight: fonts.weight.full,
    color: colors.primary,
  },
});

export default Input;

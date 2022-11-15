import {useQuery, useSubscription} from '@apollo/client';
import {useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {
  Comment as CommentType,
  CommentsByPostQuery,
  CommentsByPostQueryVariables,
  ModelSortDirection,
  OnCreateCommentByPostIdSubscription,
  OnCreateCommentByPostIdSubscriptionVariables,
  OnCreateCommentSubscription,
} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import Comment from '../../components/Comment';
import {CommentsRouteProp} from '../../types/navigation';
import Input from './Input';
import {commentsByPost, onCreateCommentByPostId} from './queries';

const CommentsScreen = () => {
  const route = useRoute<CommentsRouteProp>();
  const {postId} = route.params;
  const [newComments, setNewComments] = useState<CommentType[]>([]);

  const {data, loading, error, fetchMore} = useQuery<
    CommentsByPostQuery,
    CommentsByPostQueryVariables
  >(commentsByPost, {
    variables: {
      postID: postId,
      sortDirection: ModelSortDirection.DESC,
      limit: 20,
    },
  });
  const {data: newCommentsData} = useSubscription<
    OnCreateCommentByPostIdSubscription,
    OnCreateCommentByPostIdSubscriptionVariables
  >(onCreateCommentByPostId, {variables: {postID: postId}});

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const comments =
    data?.commentsByPost?.items.filter(comment => !comment?._deleted) || [];
  const nextToken = data?.commentsByPost?.nextToken;

  useEffect(() => {
    if (newCommentsData?.onCreateCommentByPostId) {
      setNewComments(existingNewComments => [
        newCommentsData.onCreateCommentByPostId as CommentType,
        ...existingNewComments,
      ]);
    }
  }, [newCommentsData]);

  const loadMore = async () => {
    console.log('loading more posts');
    if (!nextToken || isFetchingMore) {
      return;
    }
    setIsFetchingMore(true);
    await fetchMore({variables: {nextToken}});
    setIsFetchingMore(false);
  };

  const isNewComment = (comment: CommentType) => {
    return newComments.some(c => c.id === comment.id);
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return (
      <ApiErrorMessage
        title="Error fetching comments"
        message={error.message}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={[...newComments, ...comments]}
        renderItem={({item}) =>
          item && (
            <Comment comment={item} includeDetails isNew={isNewComment(item)} />
          )
        }
        style={{padding: 10}}
        inverted
        ListEmptyComponent={() => (
          <Text>No comments. Be the first comment</Text>
        )}
        onEndReached={() => loadMore()}
      />
      <Input postId={postId} />
    </View>
  );
};

export default CommentsScreen;

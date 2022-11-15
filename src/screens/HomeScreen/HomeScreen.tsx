import {
  View,
  FlatList,
  ViewabilityConfig,
  ViewToken,
  ActivityIndicator,
} from 'react-native';
import FeedPost from '../../components/FeedPost';
import React, {useRef, useState} from 'react';
import {useQuery} from '@apollo/client';
import {postsByDate} from './queries';
import {
  ModelSortDirection,
  PostsByDateQuery,
  PostsByDateQueryVariables,
} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage/ApiErrorMessage';

const HomeScreen = () => {
  const [activePostId, setActivePostId] = useState<null | string>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const {data, loading, error, refetch, fetchMore} = useQuery<
    PostsByDateQuery,
    PostsByDateQueryVariables
  >(postsByDate, {
    variables: {
      type: 'POST',
      sortDirection: ModelSortDirection.DESC,
      limit: 10,
    },
  });

  const viewabilityConfig: ViewabilityConfig = {
    itemVisiblePercentThreshold: 51,
  };

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: Array<ViewToken>}) => {
      if (viewableItems.length > 0) {
        setActivePostId(viewableItems[0].item.id);
      }
    },
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage title="Error fetching posts" message={error.message} />
    );
  }

  const posts = (data?.postsByDate?.items || []).filter(
    post => !post?._deleted,
  );
  const nextToken = data?.postsByDate?.nextToken;

  const loadMore = async () => {
    if (!nextToken || isFetchingMore) {
      return;
    }
    setIsFetchingMore(true);
    await fetchMore({variables: {nextToken}});
    setIsFetchingMore(false);
  };

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({item}) =>
          item && <FeedPost isVisible={item.id === activePostId} post={item} />
        }
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged.current}
        onRefresh={() => refetch()}
        refreshing={loading}
        onEndReached={loadMore}
      />
    </View>
  );
};

export default HomeScreen;

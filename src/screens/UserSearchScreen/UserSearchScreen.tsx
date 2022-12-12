import {FlatList, ActivityIndicator} from 'react-native';
import React from 'react';
import UserListItem from '../../components/UserListItem';
import {useQuery} from '@apollo/client';
import {listUsers} from './queries';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import {ListUsersQuery, ListUsersQueryVariables, User} from '../../API';

const UserSearchScreen = () => {
  const {data, loading, error, refetch} = useQuery<
    ListUsersQuery,
    ListUsersQueryVariables
  >(listUsers);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <ApiErrorMessage title="Error fetching users" message={error.message} />
    );
  }

  const users = (data?.listUsers?.items || []).filter(
    user => user && !user._deleted,
  );

  return (
    <FlatList
      data={users}
      renderItem={({item}) => item && <UserListItem user={item as User} />}
      onRefresh={() => refetch()}
      refreshing={loading}
    />
  );
};

export default UserSearchScreen;

import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type CommentMetaData = {
  readOnlyFields: 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PostMetaData = {
  readOnlyFields: 'updatedAt';
}

type LikeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Comment {
  readonly id: string;
  readonly createdAt: string;
  readonly comment: string;
  readonly User?: User;
  readonly Post?: Post;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Comment, CommentMetaData>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly username?: string;
  readonly bio?: string;
  readonly website?: string;
  readonly nofPosts: number;
  readonly nofFollowers: number;
  readonly nofFollowings: number;
  readonly image?: string;
  readonly Posts?: (Post | null)[];
  readonly Comments?: (Comment | null)[];
  readonly Likes?: (Like | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class Post {
  readonly id: string;
  readonly createdAt: string;
  readonly type: string;
  readonly description?: string;
  readonly image?: string;
  readonly images?: string[];
  readonly video?: string;
  readonly nofComments: number;
  readonly nofLikes: number;
  readonly User?: User;
  readonly Likes?: (Like | null)[];
  readonly Comments?: (Comment | null)[];
  readonly updatedAt?: string;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}

export declare class Like {
  readonly id: string;
  readonly User?: User;
  readonly Post?: Post;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Like, LikeMetaData>);
  static copyOf(source: Like, mutator: (draft: MutableModel<Like, LikeMetaData>) => MutableModel<Like, LikeMetaData> | void): Like;
}
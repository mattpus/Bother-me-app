import {Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Post} from '../../API';
import styles from './styles';
import Carousel from '../Carousel';
import VideoPlayer from '../VideoPlayer';
import {Storage} from 'aws-amplify';

type Props = {
  post: Post;
  isVisible: boolean;
};
const Content = ({post, isVisible}: Props) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const downloadMedia = async () => {
    if (post.image) {
      const imageURI = await Storage.get(post.image);
      setImageUri(imageURI);
    }
  };

  useEffect(() => {
    downloadMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (imageUri) {
    return (
      <Image
        source={{
          uri: imageUri,
        }}
        style={styles.image}
      />
    );
  } else if (post.images) {
    return <Carousel images={post.images} />;
  } else if (post.video) {
    return <VideoPlayer uri={post.video} paused={!isVisible} />;
  }
  return null;
};

export default Content;

import {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {Camera} from 'expo-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import {
  CameraPictureOptions,
  CameraRecordingOptions,
  FlashMode,
} from 'expo-camera/build/Camera.types';
import {useNavigation} from '@react-navigation/native';
import {CameraNavigationProp} from '../../types/navigation';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const flashModes = [
  FlashMode.off,
  FlashMode.on,
  FlashMode.auto,
  FlashMode.torch,
];

const flashModeToIcon = {
  [FlashMode.off]: 'flash-off',
  [FlashMode.on]: 'flash-on',
  [FlashMode.auto]: 'flash-auto',
  [FlashMode.torch]: 'highlight',
};

const CameraScreen = () => {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const insets = useSafeAreaInsets();

  const camera = useRef<Camera>(null);
  const navigation = useNavigation<CameraNavigationProp>();

  useEffect(() => {
    const getPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      setHasPermissions(
        cameraPermission.status === 'granted' &&
          microphonePermission.status === 'granted',
      );
    };
    getPermission();
  }, []);

  const flipCamera = () => {
    setCameraType(currentCameraType =>
      currentCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  };

  const flipFlash = () => {
    const currentIndex = flashModes.indexOf(flash);
    const nextIndex =
      currentIndex === flashModes.length - 1 ? 0 : currentIndex + 1;
    setFlash(flashModes[nextIndex]);
  };

  const takePicture = async () => {
    if (!isCameraReady || !camera.current || isRecording) {
      return;
    }

    const options: CameraPictureOptions = {
      quality: 0.5, // 0 - very compresses & low size | 1 - compression for max quality
      base64: false, // include base64 version of the image
      skipProcessing: true, // on android, the 'processing' step messes the orientation on some devices
    };

    const result = await camera.current.takePictureAsync(options);
    navigation.navigate('Create', {
      image: result.uri,
    });
  };
  const navigateToLibrary = () => {
    launchImageLibrary(
      {mediaType: 'photo'},
      ({didCancel, errorCode, assets}) => {
        if (!didCancel && !errorCode && assets && assets.length > 0) {
          if (assets.length === 1) {
            navigation.navigate('Create', {
              image: assets[0].uri,
            });
          }
        }
      },
    );
  };

  const startRecording = async () => {
    console.warn('start recording');
    if (!isCameraReady || !camera.current || isRecording) {
      return;
    }

    const options: CameraRecordingOptions = {
      quality: Camera.Constants.VideoQuality['640:480'], // 2160p, 1080p, 720p, 480p, 640x480
      maxDuration: 60, // Maximum video duration in seconds.
      maxFileSize: 10 * 1024 * 1024, // Maximum video file size in bytes.
      mute: false,
    };
    setIsRecording(true);
    try {
      const result = await camera.current.recordAsync(options);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
    setIsRecording(false);
  };

  const stopRecording = () => {
    if (isRecording) {
      camera.current?.stopRecording();
      setIsRecording(false);
    }
  };

  // const navigateToCreateScreen = () => {
  //   navigation.navigate('Create', {
  //     images: [
  //       'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/4.jpg',
  //       'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/4.jpg',
  //     ],
  //     // image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/4.jpg',
  //   });
  // };

  if (hasPermissions === null) {
    return <Text>Loading...</Text>;
  }

  if (hasPermissions === false) {
    return <Text>No access to the camera</Text>;
  }

  return (
    <View style={styles.page}>
      <Camera
        ref={camera}
        style={styles.camera}
        type={cameraType}
        ratio="4:3"
        flashMode={flash}
        onCameraReady={() => setIsCameraReady(true)}
      />

      <View style={[styles.buttonsContainer, {top: insets.top + 25}]}>
        <MaterialIcons name="close" size={30} color={colors.white} />

        <Pressable onPress={flipFlash}>
          <MaterialIcons
            name={flashModeToIcon[flash]}
            size={30}
            color={colors.white}
          />
        </Pressable>

        <MaterialIcons name="settings" size={30} color={colors.white} />
      </View>

      <View style={[styles.buttonsContainer, {bottom: 25}]}>
        <Pressable onPress={navigateToLibrary}>
          <MaterialIcons name="photo-library" size={30} color={colors.white} />
        </Pressable>
        {isCameraReady && (
          <Pressable
            onPress={takePicture}
            onLongPress={startRecording}
            onPressOut={stopRecording}>
            <View
              style={[
                styles.circle,
                {backgroundColor: isRecording ? colors.accent : colors.white},
              ]}
            />
          </Pressable>
        )}

        <Pressable onPress={flipCamera}>
          <MaterialIcons
            name="flip-camera-ios"
            size={30}
            color={colors.white}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  camera: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',

    position: 'absolute',
  },
  circle: {
    width: 75,
    aspectRatio: 1,
    borderRadius: 75,
    backgroundColor: colors.white,
  },
});

export default CameraScreen;

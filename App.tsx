import {Linking} from 'react-native';
import Navigation from './src/navigation';
import Amplify from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import config from './src/aws-exports';
import AuthContextProvider from './src/contexts/AuthContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Client from './src/apollo/Client';
import {MenuProvider} from 'react-native-popup-menu';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as dayjs from 'dayjs';
dayjs.extend(relativeTime);

const urlOpener = async (url: string, redirectUrl: string) => {
  await InAppBrowser.isAvailable();
  const response = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (response.type === 'success') {
    Linking.openURL(response.url);
  }
};

const updatedConfig = {
  ...config,
  oauth: {
    ...config.oauth,
    redirectSignIn: 'notjustphotos://',
    redirectSignOut: 'notjustphotos://',
    urlOpener,
  },
};

Amplify.configure(updatedConfig);

const App = () => {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <AuthContextProvider>
          <Client>
            <Navigation />
          </Client>
        </AuthContextProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;

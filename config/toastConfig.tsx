import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
     {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: '#1e1e1ed8', // gray-800
        borderWidth: 1,
        borderColor: '#ffffff2a', // gray-700
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '75%',
        height: 45,
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 15,
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: '400',
        color: '#ffffffff',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: '#ff0000c0', // gray-800
        borderWidth: 1,
        borderColor: '#ffffff4d', // gray-700
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '75%',
        height: 45,
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 15,
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: '400',
        color: '#ffffffff',
      }}
    />
  ),
  info: (props: any) => (
    <InfoToast
           {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: '#000000c0', // gray-800
        borderWidth: 1,
        borderColor: '#ffffff4d', // gray-700
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '75%',
        height: 45,
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 15,
        borderRadius: 10,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: '400',
        color: '#ffffffff',
      }}
    />
  ),
};

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './assets/custom.css'
import './assets/mantine.css'
import { HomePage } from './pages/Home.page';
import { MainContext } from './contexts';
import { useContext } from 'react';
import { AppShell, Box, Flex, LoadingOverlay, Text } from '@mantine/core';
import { useOnline } from './hooks';
import { Header, ProgressBar } from './components';
import { notifications, Notifications } from '@mantine/notifications';

export default function App(props: any) {
  const { state, dispatch, isBusy } = useContext(MainContext)
  useOnline({
    online: () => {
      dispatch({ type: 'setOnline', payload: true })
      notifications.show({ color: 'green', title: 'You are back online.', message: '' })
    },
    offline: () => {
      dispatch({ type: 'setOnline', payload: false })
      notifications.show({ color: 'red', title: 'Connection to the network has been lost.', message: 'Application is now in READ ONLY mode!' })
    }
  });

  return (
    <>
      <AppShell
        header={{ height: 0 }}
        padding="xs"
      >
        <Header />
        <AppShell.Main pt={0}>
          <Box pos='relative'>
            <Notifications position="top-right" zIndex={1000} autoClose={5000} />
            <LoadingOverlay visible={isBusy} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <ProgressBar />
            <HomePage open={true} />
          </Box>
        </AppShell.Main>
        <AppShell.Footer zIndex={true ? 'auto' : 201}>
          <Flex justify="center">
            <Text size="xs">Copyright<span>&copy;</span> Habitat for Humanity Tucson 2024</Text>
          </Flex>
        </AppShell.Footer>
      </AppShell>
    </>
  )
}

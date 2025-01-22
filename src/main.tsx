import ReactDOM from 'react-dom/client';
import App from './App';
import { createTheme, MantineProvider } from '@mantine/core';
import { APIProvider } from '@vis.gl/react-google-maps';
import { MainContextProvider } from './contexts';
import { ScheduleContextProvider } from './contexts/ScheduleContext/ScheduleContext';
const theme = createTheme({
    fontFamily: 'Montserrat, sans-serif',
    defaultRadius: 'md',
    headings: {
        fontWeight: '400',
        fontFamily: 'monospace'
    }
});
(async () => {
    const props = { params: new URLSearchParams(window.location.search) }
    try {
        ReactDOM.createRoot(document.getElementById('root')!).render(
            // <StrictMode >
            <MantineProvider theme={theme} forceColorScheme={window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}>
                {/* <ErrorBoundary FallbackComponent={TopLevelError} onError={() => console.log('Top Level Error Boundary')}> */}
                {/* <APILoader apiKey={import.meta.env.VITE_GOOGLE_APIKEY} solutionChannel="GMP_GCC_placepicker_v1" /> */}
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_APIKEY} onLoad={() => console.log('Maps API has loaded.')}>
                    {/* <ScheduleContextProvider > */}
                    <MainContextProvider props={null}>
                        <MantineProvider>
                            <App props={props} />
                        </MantineProvider>
                    </MainContextProvider>
                    {/* </ScheduleContextProvider> */}
                </APIProvider>

                {/* </ErrorBoundary> */}
            </MantineProvider>
            // </StrictMode>
        )
    }
    catch (e) {
        ReactDOM.createRoot(document.getElementById('root')!).render(
            <h3>&nbsp;Trouble connecting to Receiving Wizard. You may be experiencing problems with your internet connection. Please try again later.</h3>
        );
    }
})()

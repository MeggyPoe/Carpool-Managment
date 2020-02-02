import * as React from 'react';
import { Layout } from 'antd';
import TravelPlans from './components/travelPlans/TravelPlans';

const { Content, Sider } = Layout;

interface State {
    hasError: boolean;
}

class App extends React.PureComponent<{}, State> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    public static getDerivedStateFromError = (): State => ({ hasError: true });

    public render = (): React.ReactElement => {
        const { hasError } = this.state;
        if (hasError) {
            // TODO: Design fallback UI
            return <h1>Something went wrong. Please reload the page</h1>;
        }

        return (
            <Layout>
                <Sider width="100"/>              
                <Content>
                    <TravelPlans />
                </Content>
            </Layout>
        );
    };
}

export default App;

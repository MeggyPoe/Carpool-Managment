import React from "react";
import { Layout, PageHeader, Table, DatePicker, Dropdown, Button, Icon, Menu, Drawer, Empty } from "antd";
import { TravelPlan } from "../../core/models/TravelPlan";
import { getTravelPlans, deleteTravelPlan, getLocations } from "../../core/services";
import { PaginationProps, PaginationConfig } from "antd/lib/pagination";
import moment, { Moment } from "moment";
import { KeyValue } from "../../core/common/KeyValue";
import TravelPlanForm from "./TravelPlanForm";

const { Content } = Layout;
const { MonthPicker } = DatePicker;

const defaultPageSize = 10;
const defaultPageIndex= 1;
const pageSizeOptions = ['5', '10', '30', '50'];

interface State {
    travelPlans: TravelPlan[];
    paginationOptions: PaginationProps;
    dateFrom: Moment,
    dateTo: Moment,
    isFormOpened: boolean,
    activeTravelPlan?: TravelPlan,
    locations?: KeyValue[]
}

class TravelPlans extends React.PureComponent<{}, State> {
    public constructor(props:{}) {
        super(props);

        this.state = {
            travelPlans: [],
            paginationOptions: {
                pageSize : defaultPageSize,
                current: defaultPageIndex,
                showSizeChanger: true,
                pageSizeOptions,
                total: 0,
            },
            dateFrom: moment().startOf('month'),
            dateTo: moment().endOf('month'),
            isFormOpened: false,
        };

        this.getTravelPlans();
    }

    public componentDidUpdate = (prevProps: {}, prevState: State): void => {
        const { dateFrom, paginationOptions: { current, pageSize } } = this.state;
        if(prevState.dateFrom !== dateFrom){
            this.getTravelPlans();
        }
        if(prevState.paginationOptions.current !== current){
            this.getTravelPlans();
        }
        if(prevState.paginationOptions.pageSize !== pageSize){
            this.getTravelPlans();
        }
    }

    private getTravelPlans = async (): Promise<void> => {
        const { 
            dateFrom,
            dateTo, 
            paginationOptions,
            paginationOptions: { pageSize, current }
         } = this.state;
        const travelPlans = await getTravelPlans(dateFrom.toISOString(), dateTo.toISOString(), pageSize, current );
        this.setState({
            travelPlans: travelPlans.travelPlans,
            paginationOptions: {
                ...paginationOptions,
                total: travelPlans.total,
            },
        });
    }

    private deleteTravelPlan = async (id: number) => {
        const { travelPlans } = this.state;

        await deleteTravelPlan(id);
        this.setState({
            travelPlans: travelPlans.filter(x => x.id !== id)
        })             
    }

    private handleMonthChange = (date: Moment | null) => {
        if(date){
            this.setState({ 
                dateFrom: date.startOf('month'),
                dateTo: date.endOf('month') 
            });
        }      
    }

    private handleTableChange = (
        pagination: PaginationConfig,
    ): void => {
        let { paginationOptions } = this.state;

        paginationOptions = {
            ...pagination,
            current: pagination.current,
            pageSize: pagination.pageSize,
        };

        this.setState({
            paginationOptions,
        });
    }

    private closeForm = (shouldRefresh?: boolean) => {
        if (shouldRefresh) {
            this.getTravelPlans();
        }

        this.setState({ 
            isFormOpened: false,
            activeTravelPlan: undefined,
         });
    }

    private setActiveTravelPlan = (travelPlan: TravelPlan) => {
        this.setState({ activeTravelPlan: travelPlan });
        this.handleOpenForm();
    }

    private handleOpenForm = async () => {
        const { locations } = this.state;
        if(!locations){
            const locations = await getLocations();
            this.setState({
                locations,
                isFormOpened: true
            })
        }
        else {
            this.setState({ isFormOpened: true});
        }
    }

    public render(): React.ReactElement {
        const { 
            travelPlans,
            paginationOptions,
            isFormOpened: isDrawerOpened,
            activeTravelPlan,
            locations,
        } = this.state;

        const actions = (travelPlan: TravelPlan): React.ReactElement => (
            <Menu>
              <Menu.Item key="1" onClick={(): void => this.setActiveTravelPlan(travelPlan)}>     
                Edit
               </Menu.Item>
              <Menu.Item key="2" onClick={(): Promise<void> => this.deleteTravelPlan(travelPlan.id)}>
                Delete
              </Menu.Item>    
            </Menu>
        );

        const columns =[
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Start location',
                dataIndex: 'startLocation.value',
                key: 'startLocation'
            },
            {
                title: 'End location',
                dataIndex: 'endLocation.value',
                key: 'endLocation'
            },
            {
                title: 'Start date',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (value: Date): string => moment(value).format('DD.MM.YYYY. HH:mm')
            },
            {
                title: 'End date',
                dataIndex: 'endDate',
                key: 'endDate',
                render: (value: Date): string => moment(value).format('DD.MM.YYYY. HH:mm')
            },
            {
                title: 'Car',
                dataIndex: 'car.value',
                key: 'car'
            },
            {
                title: 'Employees',
                dataIndex: 'employees',
                key: 'employees',
                render: (value: KeyValue[]): string => {
                    return value.map(x => x.value).join(', ');                                   
                }
            },
            {
                title: 'Actions',
                dataIndex: '',
                key: 'actions',
                render: (value: TravelPlan): React.ReactNode => (
                    <Dropdown
                        overlay={actions(value)}
                    >
                        <Button
                            shape="circle"
                            type="dashed"
                            id="actionsButton"
                        >
                            <Icon type="ellipsis" />
                        </Button>
                    </Dropdown>
                ),
            },
        ]

        return (
            <Content>
                <PageHeader
                    title="TRAVEL PLANS"
                    extra={
                        <React.Fragment>
                            <MonthPicker 
                            placeholder="Select month" 
                            onChange={this.handleMonthChange}
                            allowClear={false}
                            defaultValue={moment()}
                            />
                            <Button type="primary" key="1" icon="plus" onClick={(): Promise<void> => this.handleOpenForm()}>
                                Create travel plan
                            </Button>
                        </React.Fragment>
                    }               
                />
               
                <Table
                    columns={columns}
                    rowKey={(record: TravelPlan): string => record.id.toString()}
                    dataSource={travelPlans}
                    pagination={paginationOptions}
                    bordered
                    onChange={this.handleTableChange}      
                    locale={{ emptyText: <Empty description="No travel plans in selected month" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}                 
                />
                    {isDrawerOpened && (
                        <Drawer
                            title={activeTravelPlan ? "Edit travel plan" : "Add travel plan"}
                            width={600}
                            onClose={(): void => this.closeForm()}
                            visible={isDrawerOpened}
                            maskClosable={false}
                        >
                            <TravelPlanForm
                                travelPlan={activeTravelPlan}
                                locations={locations}
                                isFormVisible={isDrawerOpened}
                                handleCloseForm={this.closeForm}
                            />
                    </Drawer>
                )}
            </Content>
        );
    }
}

export default TravelPlans;
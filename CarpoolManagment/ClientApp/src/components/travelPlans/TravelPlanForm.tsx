import { Form, DatePicker, Select, Button } from "antd";
import React, { FormEvent } from "react";
import { FormComponentProps } from "antd/lib/form";
import { TravelPlan } from "../../core/models/TravelPlan";
import { KeyValue } from "../../core/common/KeyValue";
import moment from "moment";
import { RangePickerValue } from "antd/lib/date-picker/interface";
import { getCars, getEmployees, createTravelPlan, updateTravelPlan } from "../../core/services";
import { Car } from "../../core/models/Car";
import { Employee } from "../../core/models/Employee";
import { popupConfirmWithCallback } from "../../core/notifications";

const { RangePicker } = DatePicker;
const { Option } = Select;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

interface OwnProps {
    travelPlan? : TravelPlan;
    locations?: KeyValue[];
    isFormVisible: boolean;
    handleCloseForm:  (shouldRefresh?: boolean) => void;
}

type Props = OwnProps & FormComponentProps;

interface State {
    cars: Car[];
    employees: Employee[];
    selectedCarSeats: number;
}

class TravelPlanForm extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        
        const { travelPlan } = this.props;

        this.state = {
            cars: [],
            employees: [],
            selectedCarSeats: travelPlan? travelPlan.car.numberOfSeats : 0
        }

        this.handleCarSelect = this.handleCarSelect.bind(this);
    }

    public componentDidMount(){
        const { travelPlan } = this.props;
        if(travelPlan) {
            this.setCars(travelPlan.startDate, travelPlan.endDate);
            this.setEmployees(travelPlan.startDate, travelPlan.endDate)
        }
    }

    public componentDidUpdate = (prevProps: {}, prevState: State): void => {
        const { selectedCarSeats } = this.state;
        const { form: { validateFields } } = this.props;
        if(prevState.selectedCarSeats !== selectedCarSeats){       
            validateFields(['employees']);
        }
    }


    private handleTimeTravelSelect = async (dates: RangePickerValue) => {
        if(dates[0] && dates[1]){
            this.setCars(dates[0].toISOString(), dates[1].toISOString());
            this.setEmployees(dates[0].toISOString(), dates[1].toISOString());
        }        
    }

    private async setCars(dateFrom: string, dateTo: string) {
        const { 
            form: { getFieldValue, getFieldError },
            travelPlan,
        } = this.props;

        const { cars } = this.state;

        let newCars = await getCars(dateFrom, dateTo, travelPlan ? travelPlan.id : 0);
        const selectedCar = getFieldValue('car.id');
        if (selectedCar) {
            if (newCars.filter(x => x.id === selectedCar).length === 0) {
                if (newCars.length === 0) {
                    this.setCarFormItem(selectedCar, 'There are no available cars for selected time period');
                } else {
                    this.setCarFormItem(selectedCar, 'This car is not available for selected time period');
                }
                const oldCarOption = cars.filter(x => x.id === selectedCar);
                let carOption;
                if (oldCarOption.length === 0) {
                    if (travelPlan) {
                        carOption = travelPlan.car;                  
                    }
                } else {
                    carOption = oldCarOption[0];               
                }
                if (carOption) {
                    carOption.disabled = true;
                    newCars = newCars.concat(carOption);  
                }                           
            } else {
                if (getFieldError('car.id')){
                    this.setCarFormItem(selectedCar)
                }          
            }
        }
        this.setState({ cars: newCars });
    }

    private async setEmployees(dateFrom: string, dateTo: string) {
        const { 
            form: { getFieldValue, getFieldError },
            travelPlan,
        } = this.props;

        const { employees } = this.state;

        let newEmployees = await getEmployees(dateFrom, dateTo, travelPlan? travelPlan.id : 0);
        const selectedEmployees: number[] = getFieldValue('employees');
        if(selectedEmployees) {
            if (selectedEmployees.filter(x => newEmployees.map(y => y.id).includes(x)).length !== selectedEmployees.length) {
                const notAvailableEmployees = selectedEmployees.filter(x=> !newEmployees.map(y => y.id).includes(x));
                if (newEmployees.length === 0) {
                    this.setEmployeeFormItem(selectedEmployees, ['There are no available employees for selected time period']);
                } else {            
                    if(notAvailableEmployees.length === 1){
                        const notAvailableEmployeeName = employees.filter(x => x.id === notAvailableEmployees[0])[0].value.replace(/ *\([^)]*\) */g, "");
                        this.setEmployeeFormItem(selectedEmployees, [`${notAvailableEmployeeName} is not available for selected time period`]);
                    } else {
                        const notAvailableEmployeesNames = employees.filter(x => notAvailableEmployees.indexOf(Number(x.id)) !== -1).map(x => x.value).join(', ').replace(/ *\([^)]*\) */g, "");
                        this.setEmployeeFormItem(selectedEmployees, [`${notAvailableEmployeesNames} are not available for selected time period`]);
                    }      
                }
                const oldEmployeeOptions = employees.filter(x => notAvailableEmployees.indexOf(Number(x.id)) !== -1);
                let employeeOptions;
                if (oldEmployeeOptions.length === 0) {
                    if (travelPlan) {
                        employeeOptions = travelPlan.employees;                  
                    }
                } else {
                    employeeOptions = oldEmployeeOptions;               
                }
                if (employeeOptions) {
                    employeeOptions.map(x => x.disabled = true);
                    newEmployees = newEmployees.concat(employeeOptions);  
                }                           
                else {
                    if (getFieldError('employees')) {
                        this.setEmployeeFormItem(selectedEmployees)
                    }
                } 
            }
        }
        this.setState({ employees: newEmployees });
    }

    private setCarFormItem = (value: string, error?: string) => {
        const { 
            form: { setFields },
        } = this.props;
            setFields({
                car: {
                    id: {
                        errors: error ? [new Error(error)] : undefined,
                        value: value 
                    },                     
                }
            });         
    }

    private setEmployeeFormItem = (value: number[], error?: string[]) => {
        const { 
            form: { setFields },
        } = this.props;
            setFields({
                employees: {
                    errors: error ? error.map(x => new Error(x)) : undefined,
                    value: value 
                },  
            });         
    }

    private handleCarSelect = (rule: any, value: any, callback: any, source: any, options: any) => {
        try {
            if (!value) {
                  this.setState({ selectedCarSeats: 0 })
                  throw new Error('');
              } else {
                const { cars } = this.state;            
                this.setState({ selectedCarSeats: cars.filter(x => x.id === value)[0].numberOfSeats})
              }
              callback();
            } catch (err) {
              callback(err);
            }
    }

    private handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const { 
            form: { validateFields },
            travelPlan,
            handleCloseForm: handleButtonCancel,
         } = this.props;

        validateFields(async (err, values): Promise<void> => {
            if (!err) {
                const { employees } = this.state;
                if (values.employees.filter((x: number) => employees.filter(y => y.isDriver).map(y => y.id).includes(x)).length ===0) {
                    this.setEmployeeFormItem(values.employees, ['Please select atleast one driver!']);
                } else {
                    const notAvailableEmployees = values.employees.filter((x: number) => employees.filter(y => y.disabled).map(y => y.id).includes(x));           
                    if (notAvailableEmployees.length > 0) {
                        if (notAvailableEmployees.length === 1) {
                            const notAvailableEmployeeName = employees.filter(x => x.id === notAvailableEmployees[0])[0].value.replace(/ *\([^)]*\) */g, "");
                            this.setEmployeeFormItem(values.employees, [`${notAvailableEmployeeName} is not available for selected time period`]);
                        } else if (notAvailableEmployees.lenght > 0) {
                            const notAvailableEmployeesNames = employees.filter(x => notAvailableEmployees.indexOf(Number(x.id)) !== -1).map(x => x.value).join(', ').replace(/ *\([^)]*\) */g, "");
                            this.setEmployeeFormItem(values.employees, [`${notAvailableEmployeesNames} are not available for selected time period`]);
                        } 
                    } else {
                        let formData: any = {
                            startDate: values.travelTime[0].toISOString(),
                            endDate: values.travelTime[1].toISOString(),                          
                            startLocationId: values.startLocation.id,
                            endLocationId: values.endLocation.id,
                            carId: values.car.id,
                        }
                        if (travelPlan) {
                            formData.id = travelPlan.id;
                            formData.travelPlanEmployees = values.employees.map((x: number) => (
                                {
                                    id: travelPlan.employees.find(y => y.id === x)?.travelPlanEmployeeId,
                                    employeeId: x,
                                    travelPlanId: travelPlan.id
                                })
                            );
                            const response = await updateTravelPlan(formData);
                            response ? handleButtonCancel(true) : handleButtonCancel()
                        } else {
                            formData.travelPlanEmployees = values.employees.map((x: number) => ({ employeeId: x }));
                            const response = await createTravelPlan(formData);
                            response ? handleButtonCancel(true) : handleButtonCancel()
                        }
                    }         
                }                                      
            }
        });
    }

    private handleButtonCancel = () => {
        const { handleCloseForm, form: { isFieldsTouched } } = this.props;
        if(isFieldsTouched()) {
            popupConfirmWithCallback(handleCloseForm, "Are you sure? You have unsaved changes");
        }
        else {
            handleCloseForm();
        }
    }

    public render(): React.ReactElement {
        const {
            form: { getFieldDecorator, isFieldsTouched },
            locations,
            travelPlan,
        } = this.props;

        const { cars, employees, selectedCarSeats } = this.state;

        const locationOptions = locations?.map((option: KeyValue): React.ReactElement => <Option value={option.id} key={`location + ${option.id}`}>{option.value}</Option>);
        const carOptions = cars?.map((option: Car): React.ReactElement => <Option value={option.id} key={`${option.id}`} disabled={option.disabled}>{option.value}</Option>);
        const employeeOptions = employees?.map((option: Employee): React.ReactElement => <Option value={option.id} key={`${option.id}`} >{option.value}</Option>);
        return (
            <Form {...formItemLayout} id="travel-plan-form"  onSubmit={this.handleSubmit}>
                <Form.Item label="Travel period">
                    {getFieldDecorator('travelTime',{
                        initialValue: travelPlan ? [moment(travelPlan.startDate), moment(travelPlan.endDate)] : undefined,
                        rules: [{ 
                            type: 'array', 
                            required: true, 
                            message: 'Please select travel period!',
                         }],
                    })(
                        <RangePicker className="range-picker"
                            showTime={{ secondStep: 60, minuteStep: 5 }} 
                            format="DD.MM.YYYY HH:mm"
                            onChange={this.handleTimeTravelSelect} 
                        />
                    )}
                </Form.Item>
                <Form.Item label="Start location">
                    {getFieldDecorator('startLocation.id', {
                        initialValue: travelPlan ? travelPlan.startLocation.id : undefined,
                        rules: [{ 
                            required: true, 
                            message: 'Please select start location!',                          
                         }],                      
                    })(
                        <Select placeholder="Select start location" >
                            {locationOptions}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="End location">
                    {getFieldDecorator('endLocation.id', {
                        initialValue: travelPlan ? travelPlan.endLocation.id : undefined,
                        rules: [{ required: true, message: 'Please select end location!' }],
                    })(
                        <Select placeholder="Select end location">
                            {locationOptions}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Car">
                    {getFieldDecorator('car.id', {
                        initialValue: travelPlan ? travelPlan.car.id : undefined,
                        rules: [{ required: true, message: 'Please select car!', validator: this.handleCarSelect }],   
                                          
                    })(
                        <Select placeholder="Select car">
                            {carOptions}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Employees">
                    {getFieldDecorator('employees', {
                        initialValue: travelPlan ? travelPlan.employees.map(x => x.id) : undefined,
                        rules: [
                            { 
                                required: true, 
                                message: 'Please select atleast one driver!',
                            },
                            {
                                type: 'array',
                                max: selectedCarSeats,
                                message: selectedCarSeats === 0 ? 'Please select car' : 'There is not enough evailable seats',
                            },
                        ],                                                               
                    })(
                        <Select placeholder="Select employees" mode="multiple">
                            {employeeOptions}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <div className="buttons-wrapper">
                        <Button
                            className="form-button-close"
                            type="default"
                            onClick={this.handleButtonCancel}
                            icon="close"
                            >
                                Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={!isFieldsTouched()}
                            icon="save"
                        >
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create<Props>()(TravelPlanForm);
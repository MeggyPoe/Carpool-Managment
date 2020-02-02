import { KeyValue } from '../common/KeyValue';
import { Disabeable } from '../common/Disabeable';

export interface Employee extends KeyValue, Disabeable {
    isDriver: number;
}

export interface TravelPlanEmployee extends Employee {
    travelPlanEmployeeId: number
}
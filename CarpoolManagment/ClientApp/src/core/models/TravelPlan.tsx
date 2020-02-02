import { KeyValue} from '../common/KeyValue'; 
import { Car } from './Car';
import { TravelPlanEmployee } from './Employee';

export interface TravelPlans{
    travelPlans: TravelPlan[],
    total: number
}

export interface TravelPlan {
    id: number;
    startLocation: KeyValue;
    endLocation: KeyValue;
    startDate: string,
    endDate: string,
    car: Car,
    employees: TravelPlanEmployee[],
    startLocationId?: number,
    endLocationId?: number,
    carId?: string
}
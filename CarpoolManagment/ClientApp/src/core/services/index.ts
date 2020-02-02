import api from '../api';
import { TravelPlans, TravelPlan } from '../models/TravelPlan';
import { AxiosResponse } from 'axios';
import { KeyValue } from '../common/KeyValue';
import { Car } from '../models/Car';
import { Employee } from '../models/Employee';

export const getTravelPlans = async (  
    dateFrom: string,
    dateTo: string,
    pageSize?: number,
    pageIndex?: number,
): Promise<TravelPlans> => api.get(
    `/travelPlans?pageSize=${pageSize}&pageIndex=${pageIndex}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
);

export const deleteTravelPlan = async (
    travelPlanId: number,
): Promise<AxiosResponse> => api.del(`/travelPlan/${travelPlanId}`);

export const createTravelPlan = async (
    travelPlan: TravelPlan,
): Promise<AxiosResponse> => api.post('/travelplan', JSON.stringify(travelPlan));

export const updateTravelPlan = async (
    travelPlan: TravelPlan,
): Promise<AxiosResponse> => api.put('/travelplan', JSON.stringify(travelPlan));

export const getLocations = async (): Promise<KeyValue[]> => api.get('/locations');

export const getCars = async(
    dateFrom: string,
    dateTo:string,
    travelPlanId?: number
): Promise<Car[]> => api.get(`/cars?dateFrom=${dateFrom}&dateTo=${dateTo}&travelPlanId=${travelPlanId}`);

export const getEmployees = async(
    dateFrom: string,
    dateTo:string,
    travelPlanId?: number
): Promise<Employee[]> => api.get(`/employees?dateFrom=${dateFrom}&dateTo=${dateTo}&travelPlanId=${travelPlanId}`);
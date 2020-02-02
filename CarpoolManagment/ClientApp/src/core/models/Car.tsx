import { KeyValue } from '../common/KeyValue';
import { Disabeable } from '../common/Disabeable';

export interface Car extends KeyValue, Disabeable {
    numberOfSeats: number;
}
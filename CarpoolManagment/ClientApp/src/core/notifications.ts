import { message, Modal } from 'antd';

const { confirm } = Modal;

export const success = (msg: string): void => {
    message.success(msg);
};

export const error = (msg?: string): void => {
    if(!msg){
        message.error('Something went wrong, please try again!');
    } else {
        message.error(msg);
    }
};

export const popupConfirmWithCallback = (
    callbackFunction: Function,
    text: string,
): void => {
    confirm({
        title: text,
        onOk(): void {
            callbackFunction();
        },
        onCancel(): void {
        },
    });
};
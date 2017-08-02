import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, Optional, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { PickerComponent, DatePickerComponent, CityPickerComponent, PickerData, PickerOptions } from "./index";
import { Observable, Observer } from "rxjs/Rx";
import { FORMAT_TYPE } from "./picker-date.component";
import { BaseService } from '../utils/base.service'

/**
 * 多列选择器Service，可直接通过Class构造选择器
 */
@Injectable()
export class PickerService extends BaseService {
    constructor(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector) {
        super(resolver, applicationRef, injector);
    }

    /**
     * 构建一个多列选择器并显示
     *
     * @param {(PickerData[][] | String[])} data 数据源
     * @param {*} [value] 默认值（限单列时会根据值自动解析，而对多列使用defaultSelect自行解析）
     * @param {number[]} [defaultSelect] 当前默认位置，数组的长度必须等同于 groups 长度
     * @param {PickerOptions} [options] 配置项
     * @returns {Observable<any>} 务必订阅结果才会显示。
     */
    show(data: PickerData[][] | String[], value?: any, defaultSelect?: number[], options?: PickerOptions): Observable<any> {
        let componentRef = this.build(PickerComponent);
        // 通过Service打开的强制设置为 `default` 以免出现 `input`
        options = Object.assign({ }, options, { type: 'default' });
        componentRef.instance.options = options;
        if (defaultSelect) componentRef.instance.defaultSelect = defaultSelect;
        componentRef.instance.groups = data;
        if (value) {
            setTimeout(() => {
                componentRef.instance.writeValue(value);
            }, 100);
        }
        componentRef.instance.hide.subscribe(() => {
            setTimeout(() => {
                this.destroy(componentRef);
            }, 100)
        });
        componentRef.instance._onShow();
        return componentRef.instance.change;
    }

    /**
     * 构建一个城市选择器并显示
     *
     * @param {*} data 城市数据，可以参考示例中的数据格式
     * @param {string} [value] 默认值，即城市编号
     * @param {*} [dataMap]
     * @param {PickerOptions} [options] 配置项
     * @returns {Observable<any>} 务必订阅结果才会显示。
     */
    showCity(data: any, value?: string, dataMap?: any, options?: PickerOptions): Observable<any> {
        let componentRef = this.build(CityPickerComponent);
        if (dataMap) componentRef.instance.dataMap = dataMap;
        // 通过Service打开的强制设置为 `default` 以免出现 `input`
        options = Object.assign({ }, options, { type: 'default' });
        componentRef.instance.options = options;
        componentRef.instance.data = data;
        if (value) {
            setTimeout(() => {
                componentRef.instance.writeValue(value);
            }, 100);
        }
        componentRef.instance.hide.subscribe(() => {
            setTimeout(() => {
                this.destroy(componentRef);
            }, 100)
        });
        setTimeout(() => {
            componentRef.instance._triggerShow();
        }, 200)
        return componentRef.instance.change;
    }

    /**
     * 构建一个日期时间选择器并显示
     *
     * @param {('date' | 'datetime' | 'time')} [type] 类型，date日期，datetime日期&时间（不包括秒），time时间（不包括秒）
     * @param {FORMAT_TYPE} [format] 日期格式化代码，实际是采用 DatePipe，所有代码内容和它一样
     * @param {Date} [value] 默认显示日期
     * @param {Date} [min] 最小时间范围
     * @param {Date} [max] 最大时间范围
     * @param {PickerOptions} [options] 配置项
     * @returns {Observable<any>} 务必订阅结果才会显示。
     */
    showDateTime(type?: 'date' | 'datetime' | 'time', format?: FORMAT_TYPE,
        value?: Date, min?: Date, max?: Date, options?: PickerOptions): Observable<any> {
        let componentRef = this.build(DatePickerComponent);
        // 通过Service打开的强制设置为 `default` 以免出现 `input`
        options = Object.assign({ }, options, { type: 'default' });
        componentRef.instance.options = options;
        if (format) componentRef.instance.format = format;
        if (min) componentRef.instance.min = min;
        if (max) componentRef.instance.max = max;
        if (value) {
            setTimeout(() => {
                componentRef.instance.writeValue(value);
            }, 100);
        }
        componentRef.instance.hide.subscribe(() => {
            setTimeout(() => {
                this.destroy(componentRef);
            }, 100)
        });
        setTimeout(() => {
            componentRef.instance.ngOnChanges(null);
            componentRef.instance._triggerShow();
        }, 200)
        return componentRef.instance.change;
    }

}

import request from './request';

import qs from 'querystringify';

// 根据no查询生效时间内最新的模板
export const queryPages4Form = datappId =>
  request.post(`datapp/queryPages4Form?datappId=${datappId ?? ''}`, {
    orderBy: 'last_modify_time',
    orderSort: 'DESC',
  });
export const queryForm = async id => {
  try {
    const result = await request.get(`form/v2/queryById?id=${id ?? ''}`, {
      orderBy: 'last_modify_time',
      orderSort: 'DESC',
    });
    return result;
  } catch (error) {
    console.error('查询表单失败' + error.message);
  }
};
export const queryDetail = async id => {
  try {
    const result = await request.get(
      `form/v2/detail/queryById?id=${id ?? ''}`,
      {
        orderBy: 'last_modify_time',
        orderSort: 'DESC',
      }
    );
    return result;
  } catch (error) {
    console.error('查询表单失败' + error.message);
  }
};
export const querySunDataId = async ({
  formId,
  subTableCompId,
  dataId,
  type = 'form',
  btnId,
}) => {
  const param = qs.stringify(
    { formId, subTableCompId, dataId, type, btnId },
    true
  );
  try {
    const result = await request.get(`bxyhyk/form/data/querySunDataId${param}`);
    return result;
  } catch (error) {
    console.error('查询孙表dataId失败' + error.message);
  }
};

export const queryFormStruct = async id => {
  try {
    const { data } = await queryForm(id);
    const result = getStructNames(data.formComponents);

    return result;
  } catch (error) {
    console.error('查询字段失败' + error.message);
  }
};

export const queryDetailStruct = async id => {
  try {
    const { data } = await queryDetail(id);
    const result = getStructNames(data.detailColumnList);

    return result;
  } catch (error) {
    console.error('查询字段失败' + error.message);
  }
};

export const getStructNames = formComponents =>
  formComponents
    .filter(comp => comp.componentPhysicalFieldMappingList)
    .map(comp =>
      comp.componentPhysicalFieldMappingList.map(item => item.structName)
    )
    .flat(1)
    .filter(structName => structName);

// 根据主键data_id查询模板信息
export const queryByDataId = no =>
  request.get(`spreadjs/template/queryByDataId?data_id=${no ?? ''}`);

//一键生成绑定资产
export const formGenerateAsset = params =>
  request.post('ext/bxy/formGenerateAsset', params)

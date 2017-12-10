import dynamic from 'dva/dynamic';
import myComponent from './component';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

function pathToFileName(path){
  return path.substr(0,1).toLocaleUpperCase()+path.substr(1);
}

// nav data
export const getNavData = (app,data) => {

  let oneMenu = [];

  if(data && data.userRole){
    for(let i in data.userRole){
        let iHasChildren = data.userRole[i].children && data.userRole[i].children.length > 0;
        oneMenu.push({
          name: data.userRole[i].name,
          icon: 'user',
          path: iHasChildren?
                data.userRole[i].code
                :
                data.userRole[i].system_url + data.userRole[i].url,
        })
        if(iHasChildren){
          let twoMenu = [];
          for(let j in data.userRole[i].children){
            let jHasChildren = data.userRole[i].children[j].children && data.userRole[i].children[j].children.length > 0;
            twoMenu.push({
              name: data.userRole[i].children[j].name,
              path: jHasChildren?
                    data.userRole[i].children[j].code.replace('WYB_','')
                    :
                    data.userRole[i].children[j].system_url + data.userRole[i].children[j].url,
            })
            
            if(jHasChildren){
              let threeMenu = [];
              for(let k in data.userRole[i].children[j].children){
                let urlCodeArr = data.userRole[i].children[j].children[k].url.split('/');
                let objName = data.userRole[i].children[j].children[k].type === 1?{
                  name: data.userRole[i].children[j].children[k].name,
                }:{};
                let fileName = urlCodeArr[urlCodeArr.length - 2]+pathToFileName(urlCodeArr[urlCodeArr.length - 1]);
                let threeCode = data.userRole[i].children[j].children[k].code;
                let isMyComponent = data.userRole[i].code === 'wuyoubao' && Object.keys(myComponent).indexOf(threeCode) > -1;
                let objComponent = isMyComponent?{
                  component: dynamicWrapper(app, myComponent[threeCode].models, () => import(`../routes/${myComponent[threeCode].componentUrl}`)),
                }:{};
                threeMenu.push(Object.assign({
                  path: isMyComponent?
                    `${urlCodeArr[urlCodeArr.length - 2]}/${urlCodeArr[urlCodeArr.length - 1]}`
                    :
                    data.userRole[i].children[j].children[k].system_url + data.userRole[i].children[j].children[k].url,
                },objName,objComponent))
              }
              
              twoMenu[j].children = threeMenu;
            }
            
          }
          oneMenu[i].children = twoMenu;
        }
    }
  }

  

  return [
    {
      component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
      layout: 'BasicLayout',
      name: '首页', // for breadcrumb
      path: '/',
      children: [
        {
          path: '/wuyoubao/crm/index',
          component: dynamicWrapper(app, [], () => import(`../routes/Index`)),
        }
      ].concat(oneMenu),
    }
  ]
};

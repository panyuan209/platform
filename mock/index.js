const fs = require('fs');
const path = require('path');
const Mock = require('mockjs');//mockjs 导入依赖模块
const JSON5 = require('json5');

//读取json文件
function getJsonFile(filePath) {
    //读取指定json文件
    var json = fs.readFileSync(filePath, 'utf-8');
    //解析并返回
    return JSON5.parse(json);
}

//返回一个函数
module.exports = function (app) {
    app.all('/mock*', function (rep, res, next) {
        let filePath = './modules/' + rep._parsedUrl.path.split('/').filter(v => !!v && v != 'mock').join('/') + '.json5'
        filePath = path.resolve(__dirname, filePath)
        if (fs.existsSync(filePath)) {
            var json = getJsonFile(filePath);
            res.json({
                code: 200,
                data: Mock.mock(json),
                message: 'success'
            });
            return
        }
        res.send(`mock接口${rep._parsedUrl.path}不存在`)
    });
};

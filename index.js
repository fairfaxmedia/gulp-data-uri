
var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');

module.exports = function(obj) {

    var datauri = function(file, callback) {
        var app_path = path.dirname(module.parent.filename);
        // regexp was originally /url\(['|"](.+)['|"]\)/g
        var reg_exp = /url\(['|"]?(.+?)['|"]?\)/g;
        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;

        if (isBuffer) {
            var str = String(file.contents);

            var matches = [], found;
            while (found = reg_exp.exec(str)) {
                matches.push({'txt':found[0],'url':found[1]});
            }

            for(var i=0, len=matches.length; i<len; i++){

                if (obj && obj.verbose) {
                    gutil.log("Converting resource to data URI: " + matches[i].url);
                }

                if(matches[i].url.indexOf('data:image') === -1){//if find -> image already decoded

                    var urlPath = path.normalize(matches[i].url);

                    // Strip cache-busting suffix, e.g. fontawesome-webfont.eot?v=4.3.0
                    urlPath = urlPath.replace(/\?[^\/]*$/, '');

                    var filepath = '';
                    if (obj && obj.base && obj.base.length) {

                        var found = false;
                        var exclude = false;
                        var tried = [];
                        obj.base.forEach(function(val){

                            if(!/\/$/.test(val)) {
                                val = val + '/';
                            }
                            filepath = app_path+'/'+val+urlPath;

                            if (obj.exclude && obj.exclude.length) {
                                obj.exclude.forEach(function(item){
                                    if (new RegExp(item).test(matches[i].url)) {
                                        exclude = true;
                                    }
                                })
                            }

                            if (fs.existsSync(filepath) && !exclude) {
                                found++;
                                var b = fs.readFileSync(filepath);
                                var format = path.extname(filepath).substr(1);

                                if (/svg/.test(format)) {
                                    format += '+xml';
                                }

                                str = str.replace(matches[i].url,('data:image/'+format+';base64,'+b.toString('base64')));
                            }

                            tried.push('gulp-data-uri:', gutil.colors.yellow('file not found at path') + gutil.colors.gray(' (' + filepath + ')'));

                        });

                        // If we didn't find the resource, log out all the paths we tried.
                        if (!found && !exclude) {
                            tried.forEach(function(val){
                                gutil.log(val);
                            });
                        }

                    } else {

                        filepath = app_path+urlPath;

                        if (fs.existsSync(filepath)) {
                            var b = fs.readFileSync(filepath);
                            str = str.replace(matches[i].url,('data:image/'+path.extname(filepath).substr(1)+';base64,'+b.toString('base64')));
                        }
                        else{
                            gutil.log('gulp-data-uri:', gutil.colors.yellow('file not found at path') + gutil.colors.gray(' (' + filepath + ')'));
                        }

                    }

                }
            }
            file.contents = new Buffer(str);

            return callback(null, file);
        }

        callback(null, file);
    };

    return es.map(datauri);
};

// @author Dylan Mao <maverickpuss@gmail.com>
// usage:
// install this plugin after all your css been processed:
// new MergeSPAComponentStyles({
//   spaTester: function (assetName) { return Reg Match Result | false},
//   comsResolver: function (spaName) {
//     if (filename.indexOf(spaName) > -1) {
//       return filename;
//     }

//     return false;
//   }
// })

function MergeSPAComponentStyles(options) {
  this.options = Object.assign({
    spaTester: function (asset) {
      let res = asset.match(/css\/pages\/(.+)?\.css/);
      if (res) {
        return res;
      }

      res = asset.match(/css\/(base)\.css/);
      if (res) {
        return res;
      }

      return false;
    },

    comsResolver: function (spaName) {
      return 'css/components/' + spaName +'.css';
    },

    // the merge strategy
    tpl: '{spa}\n{com}',

    // remove extracted component stylesheets?
    removeComs: true
  }, options);
}

MergeSPAComponentStyles.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    let spaFile,
        spaName;

    for (let asset in compilation.assets) {
      let matchRes = this.options.spaTester(asset);

      if (matchRes) {
        spaFile = matchRes[0];
        spaName = matchRes[1];

        // try to find matching component
        let matchCom = this.options.comsResolver(spaName);

        // found component css
        if (matchCom in compilation.assets) {
          let spaCss = compilation.assets[spaFile].source();
          let comCss = compilation.assets[matchCom].source();
          let mergedCss = this.options.tpl.replace('{spa}', spaCss);
          mergedCss = mergedCss.replace('{com}', comCss);

          // Insert this list into the Webpack build as a new file asset:
          compilation.assets[spaFile] = {
            source: function() {
              return mergedCss;
            },
            size: function() {
              return mergedCss.length;
            }
          };

          // remove component stylesheets
          if (this.options.removeComs) {
            delete compilation.assets[matchCom];
          }
        }
      }
    }

    callback(null);
  }.bind(this));
};

module.exports = MergeSPAComponentStyles;

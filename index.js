var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var helperDate = require('helper-date');

function normalizeNetworkName (network) {
  return (network || '').toLowerCase().replace(/\s/g, '-')
}

function render(resume) {
  var css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
  var cssOverrides = ''
  try {
    cssOverrides = fs.readFileSync(process.cwd() + '/overrides.css', 'utf-8');
  } catch (e) {
    //
  }
  var tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');
  var partialsDir = path.join(__dirname, 'partials');
  var filenames = fs.readdirSync(partialsDir);

  Handlebars.registerHelper('date', helperDate);
  Handlebars.registerHelper('normalizeNetworkName', normalizeNetworkName)

  filenames.forEach(function(filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    var name = matches[1];
    var filepath = path.join(partialsDir, filename);
    var template = fs.readFileSync(filepath, 'utf8');
    Handlebars.registerPartial(name, template);
  });

  return Handlebars.compile(tpl)({
    css: css + '\n\n' + cssOverrides,
    resume: resume,
  });
}

module.exports = {
  render: render,
};

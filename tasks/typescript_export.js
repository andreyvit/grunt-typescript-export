'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('typescript_export', 'Concat all .d.ts into a single file for external clients to import.', function() {
    grunt.config.requires('pkg.name');
    var packageName = grunt.config('pkg.name');

    this.files.forEach(function(group) {
      var snippets = [];
      var references = [];
      var imports = [];
      var sources = [];
      var localImportsToStrip = [];

      grunt.file.expand(group.src).forEach(function (file) {
        if (!grunt.file.exists(file)) {
          grunt.log.warn('Source file "' + file + '" not found.');
          return;
        }

        var lines = grunt.file.read(file).trim().split("\n");
        lines = lines.filter(function(line) {
          if (line.match(/<reference/)) {
            line = line.replace(/(<reference path=")\.\.\//g, '$1./');
            if (references.indexOf(line) === -1) {
              references.push(line);
            }
            return false;
          } else if (line.match(/^import /)) {
            var m;
            if (m = line.match(/^import (\w+) = require\('.\//)) {
              var name = m[1];
              grunt.log.writeln('File "' + file + '" imports local module "' + name + '"');
              if (localImportsToStrip.indexOf(name) === -1) {
                localImportsToStrip.push(name);
              }
            } else {
              if (imports.indexOf(line) === -1) {
                imports.push(line);
              }
            }
            return false;
          } else {
            return true;
          }
        });

        var content = lines.join("\n") + "\n";
        content = content.replace(/ declare /g, ' ').replace(/\bdeclare /g, '');

        sources.push({ content: content, file: file });
      });

      sources.forEach(function(source) {
        localImportsToStrip.forEach(function(name) {
          var re = new RegExp('\\b' + name + '\\.');
          source.content = source.content.replace(re, '');
        });
      });

      if (references.length > 0) {
        references.forEach(function(line) {
          snippets.push(line + "\n");
        });
        snippets.push("\n");
      }

      snippets.push('declare module "' + packageName + '" {\n\n');

      if (imports.length > 0) {
        imports.forEach(function(line) {
          snippets.push(line + "\n");
        });
        snippets.push("\n");
      }

      sources.forEach(function(source) {
        snippets.push("// " + source.file + "\n");
        snippets.push(source.content);
        snippets.push("\n");
      });
      snippets.push('}\n');

      grunt.file.write(group.dest, snippets.join(''));
      grunt.log.writeln('File "' + group.dest + '" created.');
    });
  });

};

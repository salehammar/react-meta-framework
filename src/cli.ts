#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './cli/project-creator.js';
import { generateTemplate, listTemplates } from './cli/template-generator.js';
import { createAICodegen } from './ai/codegen.js';

const program = new Command();

program
  .name('react-meta')
  .description('A batteries-included meta-framework for React')
  .version('0.1.0');

program
  .command('create <project-name>')
  .description('Create a new React Meta Framework project')
  .option('-t, --template <template>', 'Template to use (default, typescript, minimal)', 'default')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (projectName, options) => {
    try {
      await createProject(projectName, options);
      console.log(chalk.green(`\n✨ Project "${projectName}" created successfully!`));
      console.log(chalk.blue(`\nNext steps:`));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white(`  npm install`));
      console.log(chalk.white(`  npm run dev`));
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

program
  .command('generate <template-type> <project-name>')
  .description('Generate additional templates or components')
  .option('-o, --output <path>', 'Output directory', '.')
  .action(async (templateType, projectName, options) => {
    try {
      if (templateType === 'list') {
        listTemplates();
        return;
      }
      await generateTemplate(templateType, projectName);
      console.log(chalk.green(`\n✨ Template "${templateType}" generated successfully!`));
    } catch (error) {
      console.error(chalk.red('Error generating template:'), error);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all available templates')
  .action(() => {
    listTemplates();
  });

program
  .command('ai')
  .description('AI-assisted code generation')
  .addCommand(
    new Command('design')
      .description('Generate React components from design data')
      .argument('<design-file>', 'Path to design file (JSON)')
      .option('-o, --output <path>', 'Output directory', './generated')
      .option('-s, --style <style>', 'Styling approach (css, tailwind, styled-components)', 'tailwind')
      .option('-f, --framework <framework>', 'Target framework (react, next, remix)', 'react')
      .option('--tests', 'Generate tests', false)
      .option('--docs', 'Generate documentation', false)
      .action(async (designFile, options) => {
        try {
          console.log(chalk.blue('🤖 AI Code Generation from Design'));
          console.log(chalk.gray(`Design file: ${designFile}`));
          
          const codegen = createAICodegen();
          
          // Load design data
          const fs = await import('fs-extra');
          const designData = await fs.readJson(designFile);
          
          const result = await codegen.generateFromDesign(designData, {
            target: 'react-meta',
            style: options.style,
            framework: options.framework,
            generateTests: options.tests,
            generateDocs: options.docs
          });
          
          if (result.success) {
            console.log(chalk.green('✅ Code generation successful!'));
            console.log(chalk.blue('\nGenerated files:'));
            result.code.components.forEach((_, i) => {
              console.log(chalk.white(`  📄 Component${i + 1}.tsx`));
            });
            result.code.types.forEach((_, i) => {
              console.log(chalk.white(`  📄 types${i + 1}.ts`));
            });
            result.code.hooks.forEach((_, i) => {
              console.log(chalk.white(`  📄 hooks${i + 1}.ts`));
            });
            
            if (result.suggestions.length > 0) {
              console.log(chalk.yellow('\n💡 Suggestions:'));
              result.suggestions.forEach(suggestion => {
                console.log(chalk.white(`  • ${suggestion}`));
              });
            }
          } else {
            console.error(chalk.red('❌ Code generation failed:'));
            result.errors.forEach(error => {
              console.error(chalk.red(`  ${error}`));
            });
          }
        } catch (error) {
          console.error(chalk.red('Error in AI design generation:'), error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('api')
      .description('Generate API client from OpenAPI specification')
      .argument('<api-spec>', 'Path to OpenAPI specification file (JSON/YAML)')
      .option('-o, --output <path>', 'Output directory', './generated')
      .option('-f, --framework <framework>', 'Target framework (react, next, remix)', 'react')
      .option('--tests', 'Generate tests', false)
      .option('--docs', 'Generate documentation', false)
      .action(async (apiSpec, options) => {
        try {
          console.log(chalk.blue('🤖 AI Code Generation from API Specification'));
          console.log(chalk.gray(`API spec: ${apiSpec}`));
          
          const codegen = createAICodegen();
          
          // Load API specification
          const fs = await import('fs-extra');
          const yaml = await import('js-yaml');
          
          let apiData;
          if (apiSpec.endsWith('.yaml') || apiSpec.endsWith('.yml')) {
            const content = await fs.readFile(apiSpec, 'utf8');
            apiData = yaml.load(content);
          } else {
            apiData = await fs.readJson(apiSpec);
          }
          
          const result = await codegen.generateFromAPI(apiData, {
            target: 'react-meta',
            style: 'tailwind',
            framework: options.framework,
            generateTests: options.tests,
            generateDocs: options.docs
          });
          
          if (result.success) {
            console.log(chalk.green('✅ API code generation successful!'));
            console.log(chalk.blue('\nGenerated files:'));
            result.code.hooks.forEach((_, i) => {
              console.log(chalk.white(`  📄 api-hooks${i + 1}.ts`));
            });
            result.code.types.forEach((_, i) => {
              console.log(chalk.white(`  📄 api-types${i + 1}.ts`));
            });
            result.code.components.forEach((_, i) => {
              console.log(chalk.white(`  📄 api-component${i + 1}.tsx`));
            });
            
            if (result.suggestions.length > 0) {
              console.log(chalk.yellow('\n💡 Suggestions:'));
              result.suggestions.forEach(suggestion => {
                console.log(chalk.white(`  • ${suggestion}`));
              });
            }
          } else {
            console.error(chalk.red('❌ API code generation failed:'));
            result.errors.forEach(error => {
              console.error(chalk.red(`  ${error}`));
            });
          }
        } catch (error) {
          console.error(chalk.red('Error in AI API generation:'), error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('suggest')
      .description('Generate intelligent code suggestions')
      .argument('<code-file>', 'Path to code file')
      .option('-c, --context <context>', 'Analysis context (component, hook, api, performance)', 'component')
      .action(async (codeFile, options) => {
        try {
          console.log(chalk.blue('🤖 AI Code Suggestions'));
          console.log(chalk.gray(`Code file: ${codeFile}`));
          
          const codegen = createAICodegen();
          const fs = await import('fs-extra');
          
          const code = await fs.readFile(codeFile, 'utf8');
          const suggestions = codegen.generateSuggestions(code, options.context);
          
          if (suggestions.length > 0) {
            console.log(chalk.green('💡 Suggestions:'));
            suggestions.forEach(suggestion => {
              console.log(chalk.white(`  • ${suggestion}`));
            });
          } else {
            console.log(chalk.gray('No suggestions found for this code.'));
          }
        } catch (error) {
          console.error(chalk.red('Error generating suggestions:'), error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('refactor')
      .description('Intelligent code refactoring')
      .argument('<code-file>', 'Path to code file')
      .option('-t, --type <type>', 'Refactoring type (extract-component, extract-hook, optimize-performance, modernize-syntax)', 'optimize-performance')
      .option('-o, --output <path>', 'Output file path')
      .action(async (codeFile, options) => {
        try {
          console.log(chalk.blue('🤖 AI Code Refactoring'));
          console.log(chalk.gray(`Code file: ${codeFile}`));
          console.log(chalk.gray(`Refactoring type: ${options.type}`));
          
          const codegen = createAICodegen();
          const fs = await import('fs-extra');
          
          const code = await fs.readFile(codeFile, 'utf8');
          const refactoredCode = codegen.refactorCode(code, options.type);
          
          if (options.output) {
            await fs.writeFile(options.output, refactoredCode);
            console.log(chalk.green(`✅ Refactored code saved to: ${options.output}`));
          } else {
            console.log(chalk.green('✅ Refactored code:'));
            console.log(chalk.white(refactoredCode));
          }
        } catch (error) {
          console.error(chalk.red('Error refactoring code:'), error);
          process.exit(1);
        }
      })
  );

program.parse();

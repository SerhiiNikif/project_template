import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

export function compileTemplate(templateName: string, context: Record<string, any>): string {
  const templatePath = path.join(__dirname, '../../mails/templates', `${templateName}.hbs`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName} not found at ${templatePath}`);
  }
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const compiledTemplate = handlebars.compile(templateSource);
  return compiledTemplate(context);
}

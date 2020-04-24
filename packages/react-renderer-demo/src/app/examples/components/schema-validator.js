import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import DefaultSchemaError from '@data-driven-forms/react-form-renderer/dist/cjs/schema-errors';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/cjs/text-field';

const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextField
};

const schema = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'i-am-okey',
      label: 'I am label'
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'need-label'
    }
  ]
};

const schemaValidatorMapper = {
  components: {
    [componentTypes.TEXT_FIELD]: (field) => {
      if (!field.label) {
        throw new DefaultSchemaError(`Missing label prop in "${field.name}" component`);
      }
    }
  }
};

const SchemaValidationExample = () => (
  <div className="pf4">
    <FormRenderer
      FormTemplate={FormTemplate}
      componentMapper={componentMapper}
      schema={schema}
      onSubmit={console.log}
      schemaValidatorMapper={schemaValidatorMapper}
    />
  </div>
);

export default SchemaValidationExample;

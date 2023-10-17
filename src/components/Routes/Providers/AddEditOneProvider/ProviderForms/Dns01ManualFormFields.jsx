import { PropTypes } from 'prop-types';

import FormInfo from '../../../../UI/FormMui/FormInfo';
import InputArrayText from '../../../../UI/FormMui/InputArrayText';
import InputTextField from '../../../../UI/FormMui/InputTextField';

const Dns01ManualFormFields = (props) => {
  const { formState, onChange } = props;

  return (
    <>
      <FormInfo>
        Format must be:
        <br />
        variable_name=variable_value
        <br />
        <br />
        For example: <br />
        my_api_key=abcdef12345
      </FormInfo>

      <InputArrayText
        id='form.environment'
        label='Environment Variables'
        subLabel='Variable'
        value={formState.form.environment}
        onChange={onChange}
      />

      <FormInfo>
        Paths to scripts, including filename. May be relative to LeGo or
        absolute.
      </FormInfo>

      <InputTextField
        id='form.create_script'
        label='Path to DNS Record Create Script'
        value={formState.form.create_script}
        onChange={onChange}
        error={formState.validationErrors.create_script}
      />

      <InputTextField
        id='form.delete_script'
        label='Path to DNS Record Delete Script'
        value={formState.form.delete_script}
        onChange={onChange}
        error={formState.validationErrors.delete_script}
      />
    </>
  );
};

Dns01ManualFormFields.propTypes = {
  formState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dns01ManualFormFields;
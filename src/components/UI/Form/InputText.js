const InputText = (props) => {
  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        type='text'
        className='form-control'
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        readOnly={props.readOnly && true}
      />
    </div>
  );
};

export default InputText;
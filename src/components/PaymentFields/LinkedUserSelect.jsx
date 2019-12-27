import React from 'react';
import SelectItem from '../SelectItem';
import PropTypes from 'prop-types';

const LinkedUserSelect = ({ form, people }) => {
  const options = people.map(user => {
    const { userId, name } = user;

    const option = {
      value: userId,
      title: name,
    };

    return option;
  });

  const selectProps = {
    placeholder: 'Select user',
  };

  return (
    <SelectItem
      form={form}
      label="Linked user"
      id="linkedUserId"
      options={options}
      required
      selectProps={selectProps}
    />
  );
};

LinkedUserSelect.propTypes = {
  form: PropTypes.object.isRequired,
};

export default LinkedUserSelect;

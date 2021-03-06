import React from 'react';
import { mount } from 'enzyme';
import { components } from 'react-select';
import ReactSelect from 'react-select';
import DataDrivenSelect, { Select } from '../../form-fields/select/select';

describe('<Select />', () => {
  let initialProps;
  const onChange = jest.fn();
  beforeEach(() => {
    initialProps = {
      onChange,
      menuIsOpen: true,
      id: 'select',
      options: [{
        label: 'First option',
        value: 1,
      }, {
        label: 'Second option',
        value: 2,
      }],
    };
  });

  afterEach(() => {
    onChange.mockReset();
  });

  it('should return single simple value', () => {
    const wrapper = mount(<Select { ...initialProps }/>);
    const option = wrapper.find('.ddorg__pf4-component-mapper__select__menu--option').first().find('div').last();
    option.simulate('click');
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('should return single object value', () => {
    const wrapper = mount(<Select { ...initialProps } simpleValue={ false }/>);
    const option = wrapper.find('.ddorg__pf4-component-mapper__select__menu--option').first().find('div').last();
    option.simulate('click');
    expect(onChange).toHaveBeenCalledWith({ ...initialProps.options[0] });
  });

  it('should return multiple simple values', () => {
    const onChange = jest.fn();
    // simulate first return value in state
    const value = [ 1 ];
    const wrapper = mount(<Select { ...initialProps } value={ value } isMulti onChange={ onChange } closeMenuOnSelect={ false }/>);
    /**
     * select first option
     */
    const option1 = wrapper.find('.ddorg__pf4-component-mapper__select__menu--option').first().find('div').last();
    option1.simulate('click');
    /**
     * select second option
     */
    const option2 = wrapper.find('.ddorg__pf4-component-mapper__select__menu--option').last().find('div').last();
    option2.simulate('click');
    wrapper.update();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).lastCalledWith([ 1, 2 ]);
  });

  it('should return multiple object values', () => {
    const onChange = jest.fn();
    // simulate first return value in state
    const value = [{ ...initialProps.options[0] }];
    const wrapper = mount(<Select
      { ...initialProps }
      value={ value }
      simpleValue={ false }
      isMulti
      onChange={ onChange }
      closeMenuOnSelect={ false }
    />);
    /**
     * select first option
     */
    const option1 = wrapper.find('.ddorg__pf4-component-mapper__select__menu--option').first().find('div').last();
    option1.simulate('click');
    /**
     * select second option
     */
    const option2 = wrapper.find('.ddorg__pf4-component-mapper__select__menu--option').last().find('div').last();
    option2.simulate('click');
    wrapper.update();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).lastCalledWith([ ...initialProps.options ]);
  });

  it('should expand and close multi value chips', () => {
    const value = [ 1, 2 ];
    const wrapper = mount(<Select { ...initialProps } value={ value } isMulti closeMenuOnSelect={ false }/>);

    expect(wrapper.find('.ddorg__pf4-component-mapper__select__multivalue--container')).toHaveLength(1);
    const expandButton = wrapper.find('button.pf-c-button.pf-m-plain.ddorg__pf4-component-mapper__select__value--container-chipgroup');
    expandButton.simulate('click');
    expect(wrapper.find('.ddorg__pf4-component-mapper__select__multivalue--container')).toHaveLength(2);
  });

  it('should call on change when removing chip', () => {
    const value = [ 1, 2 ];
    const wrapper = mount(<Select { ...initialProps } value={ value } isMulti closeMenuOnSelect={ false }/>);

    wrapper.find(components.MultiValueRemove).first().simulate('click');
    expect(onChange).toHaveBeenCalledWith([ 2 ]);
  });

  it('should map props correctly from DataDrivenSelect to Select', () => {
    const props = {
      multi: true,
      options: [{ label: 'a', value: 1 }, { label: 'b', value: 2 }],
      name: 'foo',
      onChange: Function,
      value: [ 1, 2 ],
    };
    const wrapper = mount(<DataDrivenSelect { ...props }/>);
    const mappedProps = wrapper.find(Select).props();
    expect(mappedProps).toEqual({
      hideSelectedOptions: false,
      closeMenuOnSelect: false,
      isClearable: false,
      isMulti: true,
      onChange: Function,
      isSearchable: false,
      name: 'foo',
      options: [{ label: 'a', value: 1  }, { label: 'b', value: 2  }],
      placeholder: 'Choose...',
      selectVariant: 'default',
      showLessLabel: 'Show less',
      showMoreLabel: 'more',
      simpleValue: true,
      updatingMessage: 'Loading data...',
      value: [ 1, 2  ],
      loadingMessage: 'Loading...',
    });
  });

  it('should load Async options correctly', (done) => {
    const asyncLoading = jest.fn().mockReturnValue(Promise.resolve([{ label: 'label' }]));

    const wrapper = mount(<Select { ...initialProps } options={ undefined } loadOptions={ asyncLoading }/>);

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find(Select).first().instance().state.allOptions).toEqual([{ label: 'label' }]);
      done();
    });
  });

  it('should load Async options after filtering', (done) => {
    const asyncLoading = jest.fn().mockReturnValue(Promise.resolve([{ label: 'label' }]));

    const wrapper = mount(<Select { ...initialProps } options={ undefined } loadOptions={ asyncLoading }/>);

    setImmediate(() => {
      wrapper.update();
      const search = wrapper.find('input');
      search.getDOMNode().value = 'foo';
      search.simulate('change');
      setImmediate(() => {
        wrapper.update();
        expect(asyncLoading.mock.calls).toHaveLength(2);
        expect(asyncLoading.mock.calls[1]).toEqual([ 'foo' ]);
        done();
      });
    });
  });
});

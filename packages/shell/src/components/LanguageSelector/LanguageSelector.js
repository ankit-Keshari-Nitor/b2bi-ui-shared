import React from 'react';
import { Select, SelectItem } from '@carbon/react';
import { useConfiguration } from '../../core/providers/ConfigurationProvider';

const LanguageSelector = (props) => {
  const { locales, locale, updateLocale } = useConfiguration();
  return (
    <>
      <Select defaultValue={locale} id="language-selector" data-testid="language-chooser" labelText="" inline onChange={updateLocale}>
        {locales?.map((locale) => (
          <SelectItem key={locale.code} text={locale.display} value={locale.code}   data-testid={locale.code}/>
        ))}
      </Select>
    </>
  );
};


export {
    LanguageSelector
}
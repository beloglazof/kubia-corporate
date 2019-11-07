import { Collapse } from 'antd';
import CardInfo from '../CardInfo';
import React from 'react';

const InactivePhysicalCard = ( ) => {
  const typeId = 2;
  const handleActivateClick = () => {};
  return (
    <Collapse expandIconPosition="right" expandIcon={() => {}}>
      <Collapse.Panel
        key={typeId}
        header={
          <CardInfo
            typeName={'physical'}
            handleActivateClick={handleActivateClick}
          />
        }
        disabled
      />
    </Collapse>
  );
};

export default InactivePhysicalCard;

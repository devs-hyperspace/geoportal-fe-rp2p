import React, { useState } from 'react';
import { dataQueryAggregate } from '../../hooks/useAttributeData';
import { Card } from '@/components/ui/card';
import SkeletonWrapper from '@/components/SkeletonWrapper';

interface AttributeSummaryProps {
  attribute: any;
  layer: any;
}

const AttributeSummary: React.FC<AttributeSummaryProps> = (props) => {
  const { attribute, layer } = props;
  const dataQueryAttributeSummary = dataQueryAggregate(layer, attribute.localType, attribute.name);
  const { data, isLoading, isError } = dataQueryAttributeSummary;
  

  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <SkeletonWrapper isLoading={isLoading}>
      <Card className='p-2 w-full'>
        <h2 className="text-xl font-semibold mb-4">Attribute Summary for {data?.attribute}</h2>
        {data ? (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {Object.keys(data?.data[0]).map((key) => (
                  <th key={key} className="border px-2 py-2 font-semibold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(data?.data[0]).map((value:any, index) => (
                  <td key={index} className="border px-4 py-2">
                    {attribute.localType == 'string' ? value : value.toFixed(1)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <div>No data available</div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

export default AttributeSummary;

import BirthdayCard from '../BirthdayCard';

export default function BirthdayCardExample() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  return (
    <div className="flex flex-col gap-4 max-w-md p-6">
      <BirthdayCard 
        childName="李小明" 
        birthday={todayStr}
        language="zh-TW"
      />
      <BirthdayCard 
        childName="陳小芳" 
        birthday="2020-07-22"
        language="zh-TW"
      />
      <BirthdayCard 
        childName="Tan Wei" 
        birthday="2019-05-30"
        language="en"
      />
    </div>
  );
}

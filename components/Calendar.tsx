import dayjs from "dayjs";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  useScrollIntoView
} from 'react-native-scroll-into-view';
import { useLogs } from "../hooks/useLogs";
import { useTranslation } from "../hooks/useTranslation";
import Button from "./Button";
import CalendarMonth from "./CalendarMonth";

export default function Calendar({
  navigation
}: {
  navigation: any;
}) {
  const { state } = useLogs()
  const i18n = useTranslation()
  const today = dayjs();

  const months = [];
  for (let i = -6; i <= 0; i++) {
    const month = today.clone().add(i, 'month').startOf('month');
    months.push({
      dateString: month.format('YYYY-MM-DD'),
      items: useMemo(() => Object.keys(state.items)
        .filter(dateString => dayjs(dateString).isSame(month, 'month'))
        .map(dateString => state.items[dateString]), 
        [
          JSON.stringify(
            Object.keys(state.items)
              .filter(dateString => dayjs(dateString).isSame(month, 'month'))
              .map(dateString => state.items[dateString])
          )
        ])
    });
  }

  const futureMonths = []
  for (let i = 1; i <= 1; i++) {
    const month = today.clone().add(i, 'month').startOf('month');
    futureMonths.push({
      dateString: month.format('YYYY-MM-DD')
    });
  }
  
  const scrollIntoView = useScrollIntoView();
  const viewRef = useRef(null);
  
  useEffect(() => {
    if(viewRef.current !== null) {
      setTimeout(() => scrollIntoView(viewRef.current), 100);
    }
  }, [viewRef.current]);

  const scrollToToday = () => {
    scrollIntoView(viewRef.current, { animated: true })
  }

  return (
    <>
      <Button
        onPress={() => scrollToToday()}
        type="secondary"
        testID="calendar-back-to-today-top"
        style={{
          marginTop: 20,
        }}
      >{i18n.t('back_to_today')}</Button>
      {months.map(({ dateString, items }) => (
        <CalendarMonth 
          key={dateString} 
          dateString={dateString} 
          ref={dayjs().isSame(dateString, 'month') ? viewRef : null}
          items={items} 
        />
      ))}
      {futureMonths.map(({ dateString }) => (
        <CalendarMonth 
          key={dateString} 
          dateString={dateString} 
          ref={dayjs().isSame(dateString, 'month') ? viewRef : null}
        />
      ))}
    </>
  )
}

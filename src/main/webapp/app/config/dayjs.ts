import dayjs from 'dayjs/esm';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import duration from 'dayjs/esm/plugin/duration';
import relativeTime from 'dayjs/esm/plugin/relativeTime';
import localizedFormat from 'dayjs/esm/plugin/localizedFormat';
import utc from 'dayjs/esm/plugin/utc';
import localeData from 'dayjs/esm/plugin/localeData';
import arraySupport from 'dayjs/esm/plugin/arraySupport';
import isSameOrBefore from 'dayjs/esm/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter';

import 'dayjs/esm/locale/it';
import 'dayjs/esm/locale/en';

// DAYJS CONFIGURATION
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.extend(arraySupport);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default dayjs;

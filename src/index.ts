import { Api } from './components/base/api';
import './scss/styles.scss';
import { API_URL } from './utils/constants';

const api = new Api(API_URL);

api.get('/product')
  .then(data => console.log(data));


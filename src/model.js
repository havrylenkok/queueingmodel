'use strict';

const Rands = require("rands");
const r = new Rands();
const EventEmitter = require('events');

class Model extends EventEmitter {

  constructor() {
    super();

    this._lambda = 0.85;
    this._tSr = 1.05;
    this._mu = 1 / this._tSr;
    this._rho = this._lambda / this._mu;
    this._N = 4;

    this.P = [];
    this.P[0] = (1 - this._rho) / (1 - Math.pow(this._rho, this._N + 1));
    for (let i = 1; i < 5; i++) {
      this.P[i] = Math.pow(this._rho, i) * this.P[0];
    }

    this.pReject = this.P[4];
    this.q = 1 - this.pReject;
    this._A = this._lambda * this.q;
    this._Ls = (this._rho * (1 - (this._N + 1)) * Math.pow(this._rho, this._N) + this._N * Math.pow(this._rho, this._N + 1)) / ((1 - this._rho) * (1 - Math.pow(this._rho, this._N + 1)));
    this._Ws = this._Ls / (this._lambda * (1 - this.P[this._N]));
    this._Wq = this._Ws - 1 / this._mu;
    this._Lq = this._lambda * (1 - this.P[this._N]) * this._Wq;

    this.t1 = 0;
    this.t_okon = 0;
    this.t = 0;
    this._rn_post = Math.floor(Math.random() * (1200 - 1 + 1)) + 1;
    this.och = 0;
    this.per = 0;
    // queue time, when 1/2/3 car in
    this._t_och1 = 0;
    this._t_och2 = 0;
    this._t_och3 = 0;
// time spent in service
    this._sm_t_obs = 0;
// car num in service
    this.post = 0;
// num of denials
    this.otk = 0;
// duration in service
    this.obsl = 0;
  }

  /**
   * Simulates queueing model
   * @param k minutes, how long system works
   * @param onResultReady where to save data
   */
  p(k) {

    k = parseInt(k, 10);

    this.countOneIteration(k, () => {

      
        process.send({
          post: this.post,
          obsl: this.obsl,
          otk: this.otk,
          sm_t_obs: this._sm_t_obs,
          t_och1: this._t_och1,
          t_och2: this._t_och2,
          t_och3: this._t_och3
        });

      console.log(`Поступило на обслуживание автомобилей ${this.post}`);
      console.log(`Обслужено ${this.obsl}`);
      console.log(`Отказано в обслуживании ${this.otk}`);
      console.log(`Затрачено на обслуживание ${this._sm_t_obs} мин.`);
      console.log(`${this._t_och1} мин. 1 машина в очереди`);
      console.log(`${this._t_och2} мин. 2 машины в очереди`);
      console.log(`${this._t_och3} мин. 3 машины в очереди`);
    });



  }

  /**
   * Simulates asyncroniously {@code counter} minutes of system work
   * @param counter minutes of work
   * @param onFinish callback to save results
   */
  countOneIteration(counter, onFinish) {

    setImmediate(() => {
      this.t1 = Math.floor(Math.random() * (1200 - 1 + 1)) + 1;
      if (this.och === 1) {
        this._t_och1 = this._t_och1 + 1
      }
      if (this.och === 2) {
        this._t_och2 = this._t_och2 + 1
      }
      if (this.och === 3) {
        this._t_och3 = this._t_och3 + 1
      }
      if (this.t1 >= 1 && this.t1 <= 17 && this.t_okon === 0 && this.och >= 0 && this.och <= 3) {
        this.per = 1
      }
      if (this.t1 >= 1 && this.t1 <= 17 && this.t_okon > 0 && this.och >= 0 && this.och < 3) {
        this.per = 2
      }
      if (this.t1 >= 1 && this.t1 <= 17 && this.t_okon > 0 && this.och === 3) {
        this.per = 3
      }
      if (this.t1 > 17 && this.t_okon > 0) {
        this.per = 4
      }
      if (this.t1 > 17 && this.t_okon === 0 && this.och > 0) {
        this.per = 5
      }
      if (this.per === 1) {
        this.t_okon = r.poisson(65);
        this._sm_t_obs = this._sm_t_obs + this.t_okon;
        this.obsl = this.obsl + 1;
        this.post = this.post + 1;
      }
      if (this.per === 2) {
        this.t_okon = this.t_okon - 1;
        this.obsl = this.obsl + 1;
        this.och = this.och + 1;
        this.post = this.post + 1;
      }
      if (this.per === 3) {
        this.t_okon = this.t_okon - 1;
        this.otk = this.otk + 1;
        this.post = this.post + 1;
      }
      if (this.per === 4) {
        this.t_okon = this.t_okon - 1;
      }
      if (this.per === 5) {
        this.t_okon = r.poisson(65);
        this._sm_t_obs = this._sm_t_obs + this.t_okon;
        this.och = this.och - 1;
      }

      if (counter > 0) this.countOneIteration(--counter, onFinish);
      else onFinish();
    });
  }
}


process.send = process.send || () => {};
process.on('message', (msg) => {

  let model = new Model();
  model.p(msg, process.send);

});

module.exports = Model;

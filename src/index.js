"use strict";

const Rands = require("rands");
const r = new Rands();

const lambda = 0.85;
const tSr = 1.05;
const mu = 1 / tSr;
const rho = lambda / mu;
const N = 4;

let P = [];
P[0] = (1 - rho) / (1 - Math.pow(rho, N + 1));
for (let i = 1; i < 5; i++) {
  P[i] = Math.pow(rho, i) * P[0];
}

const Preject = P[4];
const q = 1 - Preject;
const A = lambda * q;
const Ls = (rho * (1 - (N + 1)) * Math.pow(rho, N) + N * Math.pow(rho, N + 1)) / ((1 - rho) * (1 - Math.pow(rho, N + 1)));
const Ws = Ls / (lambda * (1 - P[N]));
const Wq = Ws - 1 / mu;
const Lq = lambda * (1 - P[N]) * Wq;

let t_och1;
let t_och2;
let t_och3;
let sm_t_obs;
let post;
let otk;
let obsl;

/**
 * Simulates queueing model
 * @param k minutes, how long system works
 * @param callback where to save data
 */
function p(k, callback) {
  let t1;
  let t_okon;
  let t;
  let rn_post;
  let och;
  let per;

  t_och1 = 0;
  t_och2 = 0;
  t_och3 = 0;
  post = 0;
  otk = 0;
  obsl = 0;
  t_okon = 0;
  sm_t_obs = 0;
  och = 0;

  rn_post = Math.floor(Math.random() * (1200 - 1 + 1)) + 1;
  for (let i = 1; i <= k; i++) {
    t1 = Math.floor(Math.random() * (1200 - 1 + 1)) + 1;
    if (och == 1) {
      t_och1 = t_och1 + 1
    }
    if (och == 2) {
      t_och2 = t_och2 + 1
    }
    if (och == 3) {
      t_och3 = t_och3 + 1
    }
    if (t1 >= 1 && t1 <= 17 && t_okon == 0 && och >= 0 && och <= 3) {
      per = 1
    }
    if (t1 >= 1 && t1 <= 17 && t_okon > 0 && och >= 0 && och < 3) {
      per = 2
    }
    if (t1 >= 1 && t1 <= 17 && t_okon > 0 && och == 3) {
      per = 3
    }
    if (t1 > 17 && t_okon > 0) {
      per = 4
    }
    if (t1 > 17 && t_okon == 0 && och > 0) {
      per = 5
    }
    if (per == 1) {
      t_okon = r.poisson(65);
      sm_t_obs = sm_t_obs + t_okon;
      obsl = obsl + 1;
      post = post + 1;
    }
    if (per == 2) {
      t_okon = t_okon - 1;
      obsl = obsl + 1;
      och = och + 1;
      post = post + 1;
    }
    if (per == 3) {
      t_okon = t_okon - 1;
      otk = otk + 1;
      post = post + 1;
    }
    if (per == 4) {
      t_okon = t_okon - 1;
    }
    if (per == 5) {
      t_okon = r.poisson(65);
      sm_t_obs = sm_t_obs + t_okon;
      och = och - 1
    }
  }

  callback({
    post: post,
    obsl: obsl,
    otk: otk,
    sm_t_obs: sm_t_obs,
    t_och1: t_och1,
    t_och2: t_och2,
    t_och3: t_och3
  });

  console.log(`Поступило на обслуживание автомобилей ${post}`);
  console.log(`Обслужено ${obsl}`);
  console.log(`Отказано в обслуживании ${otk}`);
  console.log(`Затрачено на обслуживание ${sm_t_obs} мин.`);
  console.log(`${t_och1} мин. 1 машина в очереди`);
  console.log(`${t_och2} мин. 2 машины в очереди`);
  console.log(`${t_och3} мин. 3 машины в очереди`);

}
p(5000);

module.exports = p;

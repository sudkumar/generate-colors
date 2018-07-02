#!/usr/bin/env node
'use strict';

const prompt = require('prompt')
const getColorForString = require('../lib/getColorForString')

prompt.start()
prompt.get(['Input String'], function (err, result) {
  if (err) {
    return err
  }
  console.log(getColorForString(result['Input String']))
})

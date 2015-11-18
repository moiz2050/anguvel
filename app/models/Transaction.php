<?php
/**
 * Created by PhpStorm.
 * User: MUEEZ
 * Date: 12/12/2014
 * Time: 3:22 PM
 */

class Transaction extends Eloquent {
    public function customer() {
        return $this->belongsTo('Customer');
    }
}
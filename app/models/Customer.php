<?php
/**
 * Created by PhpStorm.
 * User: MUEEZ
 * Date: 12/12/2014
 * Time: 3:18 PM
 */

class Customer extends Eloquent {

    public function transactions() {
        return $this->hasMany('Transaction');
    }

} 
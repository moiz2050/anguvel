<?php
/**
 * Created by PhpStorm.
 * User: MUEEZ
 * Date: 12/12/2014
 * Time: 3:23 PM
 */

class TransactionController extends BaseController {

    public function getIndex() {
        $id = Input::get('id');
        return Customer::find($id)->transactions;
    }

    public function postIndex() {
        if (Input::has('name', 'amount')) {

            $input = Input::all();

            if ($input['name'] == '' || $input['amount'] == '') {
                return Response::make('You need to fill all of the input fields', 400);
            }

            $transaction = new Transaction;
            $transaction->name = $input['name'];
            $transaction->amount = $input['amount'];

            $id = $input['customer_id'];
            Customer::find($id)->transactions()->save($transaction);

            return $transaction;
        } else {
            return Response::make('You need to fill all of the input fields', 400);
        }
    }

    public function deleteIndex() {
        $id = Input::get('id');
        $transaction = Transaction::find($id);
        $transaction->delete();

        return $id;
    }

} 
export const ABI ={
    "name": "PricePair",
    "methods": [
        {
            "name": "opt_in",
            "args": [],
            "returns": {
                "type": "void"
            }
        },
        {
            "name": "update",
            "args": [],
            "returns": {
                "type": "void"
            }
        },
        {
            "name": "delete",
            "args": [],
            "returns": {
                "type": "void"
            }
        },
        {
            "name": "update_manager",
            "args": [
                {
                    "type": "address",
                    "name": "new_manager"
                }
            ],
            "returns": {
                "type": "void"
            }
        },
        {
            "name": "create_request_params_box",
            "args": [
                {
                    "type": "byte[]",
                    "name": "price_pair_name"
                },
                {
                    "type": "uint64",
                    "name": "token_asset_id"
                },
                {
                    "type": "(uint32,byte[][],uint32)[]",
                    "name": "source_arr"
                },
                {
                    "type": "uint32",
                    "name": "agg_method"
                },
                {
                    "type": "byte[]",
                    "name": "user_data"
                },
                {
                    "type": "pay",
                    "name": "algo_xfer"
                }
            ],
            "returns": {
                "type": "void"
            }
        },
        {
            "name": "delete_request_params_box",
            "args": [
                {
                    "type": "byte[]",
                    "name": "price_pair_name"
                }
            ],
            "returns": {
                "type": "void"
            }
        },
        {
            "name": "opt_in_gora",
            "args": [
                {
                    "type": "asset",
                    "name": "asset_reference"
                },
                {
                    "type": "application",
                    "name": "main_app_reference"
                }
            ],
            "returns": {
                "type": "void"
            }
        },
        {
            "name": "update_price",
            "args": [
                {
                    "type": "uint32",
                    "name": "response_type_bytes"
                },
                {
                    "type": "byte[]",
                    "name": "response_body_bytes"
                }
            ],
            "returns": {
                "type": "void"
            }
        },
        {
            "name": "get_pair_price",
            "args": [
                {
                    "type": "byte[]",
                    "name": "price_pair_name"
                }
            ],
            "returns": {
                "type": "byte[]"
            }
        },
        {
            "name": "send_request",
            "args": [
                {
                    "type": "byte[]",
                    "name": "price_pair_name"
                },
                {
                    "type": "byte[]",
                    "name": "key"
                }
            ],
            "returns": {
                "type": "void"
            }
        }
    ],
    "networks": {}
}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  props: ['openapi'],
  methods: {
    findModel: function findModel (schemaName) {
      // '#/components/schemas/Pet'
      var vm = this;
      var paths = schemaName.split('/');
      return vm.openapi[paths[1]][paths[2]][paths[3]]
    },
    renderSchemaReference: function renderSchemaReference (intendation, schemaReference) {
      var result = '';
      if (schemaReference.type) {
        if (schemaReference.type === 'array') {
          result += intendation + '[\n';
          result += this.renderSchemaReference(intendation + '  ', schemaReference.items);
          result += intendation + ']';
        } else if (schemaReference.type === 'string') {
          result += intendation + 'string\n';
        }
      } else if (schemaReference.$ref) {
        result += intendation + '{\n';
        result += this.renderModel(intendation + '  ', schemaReference.$ref);
        result += intendation + '}\n';
      }
      return result
    },
    renderModel: function renderModel (intendation, schemaName) {
      var result = '';
      var vm = this;
      var model = this.findModel(schemaName);
      Object.keys(model.properties).forEach(function (property, key, arr) {
        result += intendation + '"' + property + '": ';
        var propertyValue = model.properties[property];
        if (propertyValue.type === 'integer') {
          if (propertyValue.example) {
            result += propertyValue.example;
          } else {
            result += '0';
          }
        } else if (propertyValue.type === 'boolean') {
          result += 'false';
        } else if (propertyValue.type === 'string') {
          if (propertyValue.example) {
            result += '"' + propertyValue.example + '"';
          } else if (propertyValue.enum) {
            result += '"' + propertyValue.enum[0] + '"';
          } else {
            result += '"string"';
          }
        } else if (propertyValue.type === 'number') {
          if (propertyValue.example) {
            result += propertyValue.example;
          } else {
            result += '0.0';
          }
        } else if (propertyValue.type === 'array') {
          result += '[\n';
          if (propertyValue.items.type) {
            if (propertyValue.items.type === 'string') {
              result += intendation + '  "string"\n';
            } else if (propertyValue.items.type === 'integer') {
              result += intendation + '  0\n';
            } else if (propertyValue.items.type === 'number') {
              result += intendation + '  0.0\n';
            } else if (propertyValue.items.type === 'boolean') {
              result += intendation + '  false\n';
            }
          } else if (propertyValue.items.$ref) {
            result += intendation + '  {\n';
            result += vm.renderModel(intendation + '    ', propertyValue.items.$ref);
            result += intendation + '  }\n';
          }
          result += intendation + ']';
        } else if (propertyValue.$ref) {
          result += '{\n';
          result += vm.renderModel(intendation + '  ', propertyValue.$ref);
          result += intendation + '}';
        }
        if (!Object.is(arr.length - 1, key)) {
          result += ',';
        }
        result += '\n';
      });
      return result
    },
    getColorByMethod: function getColorByMethod (method) {
      var methodName = method.methodName;
      if (method.deprecated === true) {
        return 'badge-secondary'
      }
      if (methodName === 'post') {
        return 'badge-success'
      } else if (methodName === 'get') {
        return 'badge-primary'
      } else if (methodName === 'put') {
        return 'badge-warning'
      } else if (methodName === 'delete') {
        return 'badge-danger'
      }
      return 'badge-secondary'
    },
    getMethodsByTag: function getMethodsByTag (tagName) {
      var result = [];
      var vm = this;
      Object.keys(vm.openapi.paths).forEach(function (path) {
        var pathValue = vm.openapi.paths[path];
        Object.keys(pathValue).forEach(function (method) {
          var methodValue = pathValue[method];
          for (var i = 0; i < methodValue.tags.length; i++) {
            if (methodValue.tags[i] === tagName) {
              methodValue.methodName = method;
              methodValue.path = path;
              result.push(methodValue);
            }
          }
        });
      });
      return result
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "row" }, [
    !_vm.openapi.openapi.startsWith("3.")
      ? _c("div", { staticClass: "col-md-12" }, [
          _vm._v(
            "\n    \tOpenAPI schema is not supported: " +
              _vm._s(_vm.openapi.openapi) +
              "\n    "
          )
        ])
      : _c("div", { staticClass: "col-md-12" }, [
          _c("h1", [
            _vm._v(_vm._s(_vm.openapi.info.title) + " "),
            _c("span", { staticClass: "badge badge-secondary" }, [
              _vm._v(_vm._s(_vm.openapi.info.version))
            ])
          ]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "\n       \t" + _vm._s(_vm.openapi.info.description) + "\n       "
            )
          ]),
          _vm._v(" "),
          _c("ul", { staticClass: "list-unstyled" }, [
            _vm.openapi.info.termsOfService
              ? _c("li", [
                  _c(
                    "a",
                    { attrs: { href: _vm.openapi.info.termsOfService } },
                    [_vm._v("Terms of service")]
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.openapi.info.contact
              ? _c("li", [
                  _c(
                    "a",
                    {
                      attrs: {
                        href: "mailto:" + _vm.openapi.info.contact.email
                      }
                    },
                    [_vm._v("Contact the developer")]
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.openapi.info.license
              ? _c("li", [
                  _c("a", { attrs: { href: _vm.openapi.info.license.url } }, [
                    _vm._v(_vm._s(_vm.openapi.info.license.name))
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.openapi.externalDocs
              ? _c("li", [
                  _c("a", { attrs: { href: _vm.openapi.externalDocs.url } }, [
                    _vm._v(_vm._s(_vm.openapi.externalDocs.description))
                  ])
                ])
              : _vm._e()
          ]),
          _vm._v(" "),
          _c("p"),
          _c("form", [
            _c("div", { staticClass: "form-row" }, [
              _c("div", { staticClass: "form-group col-md-12" }, [
                _c("label", { attrs: { for: "servers" } }, [_vm._v("Servers")]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-md-6" }, [
                    _c(
                      "select",
                      { staticClass: "form-control", attrs: { id: "servers" } },
                      _vm._l(_vm.openapi.servers, function(server) {
                        return _c("option", [_vm._v(_vm._s(server.url))])
                      }),
                      0
                    )
                  ]),
                  _vm._v(" "),
                  _vm.openapi.components.securitySchemes
                    ? _c(
                        "div",
                        { staticClass: "col-md-6" },
                        [
                          _c(
                            "b-button",
                            {
                              directives: [
                                {
                                  name: "b-modal",
                                  rawName: "v-b-modal.modal-1",
                                  modifiers: { "modal-1": true }
                                }
                              ],
                              staticClass: "pull-right"
                            },
                            [_vm._v("Authentication")]
                          ),
                          _vm._v(" "),
                          _c(
                            "b-modal",
                            {
                              attrs: {
                                id: "modal-1",
                                "ok-only": "",
                                title: "Authentication"
                              }
                            },
                            _vm._l(
                              _vm.openapi.components.securitySchemes,
                              function(security, securityName) {
                                return _c("div", [
                                  security.type === "apiKey"
                                    ? _c("div", [
                                        _c("h3", [
                                          _vm._v(_vm._s(securityName))
                                        ]),
                                        _vm._v(" "),
                                        _c("p", { staticClass: "text-muted" }, [
                                          _vm._v(_vm._s(security.type))
                                        ]),
                                        _vm._v(" "),
                                        _c("p", [
                                          _vm._v(
                                            "\n    \t\t\t\t     \tName: " +
                                              _vm._s(security.name)
                                          ),
                                          _c("br"),
                                          _vm._v(
                                            "\n    \t\t\t\t     \tIn: " +
                                              _vm._s(security.in) +
                                              "\n    \t\t\t\t     "
                                          )
                                        ])
                                      ])
                                    : _vm._e(),
                                  _vm._v(" "),
                                  security.type === "http" &&
                                  security.scheme === "bearer"
                                    ? _c("div", [
                                        _c("h3", [
                                          _vm._v(_vm._s(securityName))
                                        ]),
                                        _vm._v(" "),
                                        _c("p", { staticClass: "text-muted" }, [
                                          _vm._v(
                                            _vm._s(security.type) +
                                              ", " +
                                              _vm._s(security.scheme)
                                          )
                                        ]),
                                        _vm._v(" "),
                                        _c("p", [
                                          _vm._v(
                                            "\n    \t\t\t\t     \tIn: header"
                                          ),
                                          _c("br"),
                                          _vm._v(
                                            "\n    \t\t\t\t     \tExample: "
                                          ),
                                          _c(
                                            "code",
                                            {
                                              staticClass: "text-white bg-dark"
                                            },
                                            [
                                              _vm._v(
                                                "Authorization: Bearer <token>"
                                              )
                                            ]
                                          )
                                        ])
                                      ])
                                    : _vm._e()
                                ])
                              }
                            ),
                            0
                          )
                        ],
                        1
                      )
                    : _vm._e()
                ])
              ])
            ])
          ]),
          _vm._v(" "),
          _c("p"),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "accordion", attrs: { role: "tablist" } },
            _vm._l(_vm.openapi.tags, function(tag, index) {
              return _c(
                "b-card",
                {
                  key: tag.name,
                  staticClass: "mb-1",
                  attrs: { "no-body": "" }
                },
                [
                  _c(
                    "b-card-header",
                    {
                      directives: [
                        {
                          name: "b-toggle",
                          rawName: "v-b-toggle",
                          value: "accordion" + index,
                          expression: "`accordion${index}`"
                        }
                      ],
                      staticClass: "mb-0",
                      attrs: { "header-tag": "header", role: "tab" }
                    },
                    [
                      _c(
                        "b-button",
                        { attrs: { variant: "link", href: "#" } },
                        [_c("strong", [_vm._v(_vm._s(tag.name))])]
                      ),
                      _c("span", { staticClass: "text-muted align-middle" }, [
                        _vm._v(_vm._s(tag.description))
                      ]),
                      _vm._v(" "),
                      tag.externalDocs
                        ? _c("span", { staticClass: "pull-right" }, [
                            _vm._v(_vm._s(tag.externalDocs.description) + ": "),
                            _c("a", { attrs: { href: tag.externalDocs.url } }, [
                              _vm._v(_vm._s(tag.externalDocs.url))
                            ])
                          ])
                        : _vm._e()
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "b-collapse",
                    {
                      attrs: {
                        id: "accordion" + index,
                        accordion: "accordion",
                        role: "tabpanel"
                      }
                    },
                    [
                      _c("b-card-body", [
                        _c(
                          "div",
                          {
                            staticClass: "accordion",
                            attrs: { role: "tablist" }
                          },
                          _vm._l(_vm.getMethodsByTag(tag.name), function(
                            method,
                            index
                          ) {
                            return _c(
                              "b-card",
                              {
                                key: index,
                                staticClass: "mb-1",
                                attrs: { "no-body": "" }
                              },
                              [
                                _c(
                                  "b-card-header",
                                  {
                                    staticClass: "mb-0",
                                    attrs: {
                                      "header-tag": "header",
                                      role: "tab"
                                    }
                                  },
                                  [
                                    method.security
                                      ? _c(
                                          "svg",
                                          {
                                            attrs: {
                                              xmlns:
                                                "http://www.w3.org/2000/svg",
                                              width: "16",
                                              height: "16",
                                              viewBox: "0 0 8 8"
                                            }
                                          },
                                          [
                                            _c("path", {
                                              attrs: {
                                                d:
                                                  "M3 0c-1.1 0-2 .9-2 2v1h-1v4h6v-4h-1v-1c0-1.1-.9-2-2-2zm0 1c.56 0 1 .44 1 1v1h-2v-1c0-.56.44-1 1-1z",
                                                transform: "translate(1)"
                                              }
                                            })
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v("\n\t\t\t         "),
                                    _c(
                                      "span",
                                      {
                                        class:
                                          "badge " +
                                          _vm.getColorByMethod(method)
                                      },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            method.methodName.toUpperCase()
                                          )
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "b-button",
                                      {
                                        directives: [
                                          {
                                            name: "b-toggle",
                                            rawName: "v-b-toggle",
                                            value:
                                              "accordion" + tag.name + index,
                                            expression:
                                              "`accordion${tag.name}${index}`"
                                          }
                                        ],
                                        attrs: { variant: "link", href: "#" }
                                      },
                                      [
                                        method.deprecated
                                          ? _c("del", [
                                              _c(
                                                "strong",
                                                { staticClass: "text-muted" },
                                                [_vm._v(_vm._s(method.path))]
                                              )
                                            ])
                                          : _c("strong", [
                                              _vm._v(_vm._s(method.path))
                                            ])
                                      ]
                                    ),
                                    _c(
                                      "span",
                                      {
                                        staticClass: "text-muted align-middle"
                                      },
                                      [_vm._v(_vm._s(method.summary))]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "b-collapse",
                                  {
                                    attrs: {
                                      id: "accordion" + tag.name + index,
                                      accordion: "accordion" + tag.name,
                                      role: "tabpanel"
                                    }
                                  },
                                  [
                                    _c("b-card-body", [
                                      method.deprecated
                                        ? _c(
                                            "p",
                                            { staticClass: "text-muted" },
                                            [_vm._v("Warning: Deprecated")]
                                          )
                                        : _vm._e(),
                                      _vm._v(" "),
                                      method.description
                                        ? _c("p", [
                                            _vm._v(_vm._s(method.description))
                                          ])
                                        : _vm._e(),
                                      _vm._v(" "),
                                      method.parameters &&
                                      method.parameters.length > 0
                                        ? _c("div", [
                                            _c("h4", [_vm._v("Parameters")]),
                                            _vm._v(" "),
                                            _c(
                                              "table",
                                              {
                                                staticClass:
                                                  "table table-striped"
                                              },
                                              [
                                                _c("thead", [
                                                  _c("tr", [
                                                    _c(
                                                      "th",
                                                      {
                                                        staticStyle: {
                                                          width: "20%"
                                                        },
                                                        attrs: { scope: "col" }
                                                      },
                                                      [_vm._v("Name")]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "th",
                                                      {
                                                        attrs: { scope: "col" }
                                                      },
                                                      [_vm._v("Value")]
                                                    )
                                                  ])
                                                ]),
                                                _vm._v(" "),
                                                _c(
                                                  "tbody",
                                                  _vm._l(
                                                    method.parameters,
                                                    function(param) {
                                                      return _c("tr", [
                                                        _c("td", [
                                                          _c("strong", [
                                                            _vm._v(
                                                              _vm._s(param.name)
                                                            )
                                                          ]),
                                                          _vm._v(" "),
                                                          param.required
                                                            ? _c(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "text-danger"
                                                                },
                                                                [
                                                                  _c("small", [
                                                                    _vm._v(
                                                                      "* required"
                                                                    )
                                                                  ])
                                                                ]
                                                              )
                                                            : _vm._e(),
                                                          _c("br"),
                                                          _vm._v(" "),
                                                          param.schema.type
                                                            ? _c("span", [
                                                                _vm._v(
                                                                  _vm._s(
                                                                    param.schema
                                                                      .type
                                                                  ) + " "
                                                                ),
                                                                param.schema
                                                                  .type ===
                                                                "array"
                                                                  ? _c("span", [
                                                                      _vm._v(
                                                                        "[" +
                                                                          _vm._s(
                                                                            param
                                                                              .schema
                                                                              .items
                                                                              .type
                                                                          ) +
                                                                          "]"
                                                                      )
                                                                    ])
                                                                  : _vm._e(),
                                                                param.schema
                                                                  .format
                                                                  ? _c("span", [
                                                                      _vm._v(
                                                                        "(" +
                                                                          _vm._s(
                                                                            param
                                                                              .schema
                                                                              .format
                                                                          ) +
                                                                          ")"
                                                                      )
                                                                    ])
                                                                  : _vm._e(),
                                                                _c("br")
                                                              ])
                                                            : _vm._e(),
                                                          _vm._v(" "),
                                                          param.in
                                                            ? _c(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "text-muted"
                                                                },
                                                                [
                                                                  _vm._v(
                                                                    "(" +
                                                                      _vm._s(
                                                                        param.in
                                                                      ) +
                                                                      ")"
                                                                  )
                                                                ]
                                                              )
                                                            : _vm._e()
                                                        ]),
                                                        _vm._v(" "),
                                                        _c("td", [
                                                          _c("p", [
                                                            _vm._v(
                                                              _vm._s(
                                                                param.description
                                                              )
                                                            )
                                                          ]),
                                                          _vm._v(" "),
                                                          param.schema.items &&
                                                          param.schema.items
                                                            .enum
                                                            ? _c("p", [
                                                                _vm._v(
                                                                  "Available values: " +
                                                                    _vm._s(
                                                                      param.schema.items.enum.join(
                                                                        ", "
                                                                      )
                                                                    )
                                                                )
                                                              ])
                                                            : _vm._e()
                                                        ])
                                                      ])
                                                    }
                                                  ),
                                                  0
                                                )
                                              ]
                                            )
                                          ])
                                        : _vm._e(),
                                      _vm._v(" "),
                                      method.requestBody
                                        ? _c("div", [
                                            _c("h4", [
                                              _vm._v("Request body"),
                                              method.requestBody.required
                                                ? _c(
                                                    "span",
                                                    {
                                                      staticClass: "text-danger"
                                                    },
                                                    [
                                                      _c("small", [
                                                        _vm._v("* required")
                                                      ])
                                                    ]
                                                  )
                                                : _vm._e()
                                            ]),
                                            _vm._v(" "),
                                            method.requestBody.description
                                              ? _c("p", [
                                                  _vm._v(
                                                    _vm._s(
                                                      method.requestBody
                                                        .description
                                                    )
                                                  )
                                                ])
                                              : _vm._e(),
                                            _vm._v(" "),
                                            method.requestBody.content &&
                                            method.requestBody.content[
                                              "application/json"
                                            ]
                                              ? _c(
                                                  "pre",
                                                  {
                                                    staticClass:
                                                      "text-white bg-dark"
                                                  },
                                                  [
                                                    _c("code", [
                                                      _vm._v(
                                                        "\n" +
                                                          _vm._s(
                                                            _vm.renderSchemaReference(
                                                              " ",
                                                              method.requestBody
                                                                .content[
                                                                "application/json"
                                                              ].schema
                                                            )
                                                          ) +
                                                          "\n"
                                                      )
                                                    ])
                                                  ]
                                                )
                                              : _vm._e()
                                          ])
                                        : _vm._e(),
                                      _vm._v(" "),
                                      _c("h4", [_vm._v("Responses")]),
                                      _vm._v(" "),
                                      _c(
                                        "table",
                                        { staticClass: "table table-striped" },
                                        [
                                          _c("thead", [
                                            _c("tr", [
                                              _c(
                                                "th",
                                                {
                                                  staticStyle: { width: "20%" },
                                                  attrs: { scope: "col" }
                                                },
                                                [_vm._v("Code")]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "th",
                                                { attrs: { scope: "col" } },
                                                [_vm._v("Description")]
                                              )
                                            ])
                                          ]),
                                          _vm._v(" "),
                                          _c(
                                            "tbody",
                                            _vm._l(method.responses, function(
                                              response,
                                              responseName
                                            ) {
                                              return _c("tr", [
                                                _c("td", [
                                                  _vm._v(_vm._s(responseName))
                                                ]),
                                                _vm._v(" "),
                                                _c("td", [
                                                  _c("p", [
                                                    _vm._v(
                                                      _vm._s(
                                                        response.description
                                                      )
                                                    )
                                                  ]),
                                                  _vm._v(" "),
                                                  response.content &&
                                                  response.content[
                                                    "application/json"
                                                  ]
                                                    ? _c(
                                                        "pre",
                                                        {
                                                          staticClass:
                                                            "text-white bg-dark"
                                                        },
                                                        [
                                                          _c("code", [
                                                            _vm._v(
                                                              "\n" +
                                                                _vm._s(
                                                                  _vm.renderSchemaReference(
                                                                    "   ",
                                                                    response
                                                                      .content[
                                                                      "application/json"
                                                                    ].schema
                                                                  )
                                                                ) +
                                                                "\n"
                                                            )
                                                          ])
                                                        ]
                                                      )
                                                    : _vm._e(),
                                                  _vm._v(" "),
                                                  response.headers
                                                    ? _c("div", [
                                                        _c("h6", [
                                                          _vm._v("Headers")
                                                        ]),
                                                        _vm._v(" "),
                                                        _c(
                                                          "table",
                                                          {
                                                            staticClass:
                                                              "table table-condensed table-hover table-sm"
                                                          },
                                                          [
                                                            _c("thead", [
                                                              _c("tr", [
                                                                _c(
                                                                  "th",
                                                                  {
                                                                    staticStyle: {
                                                                      width:
                                                                        "20%"
                                                                    },
                                                                    attrs: {
                                                                      scope:
                                                                        "col"
                                                                    }
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      "Name"
                                                                    )
                                                                  ]
                                                                ),
                                                                _vm._v(" "),
                                                                _c(
                                                                  "th",
                                                                  {
                                                                    attrs: {
                                                                      scope:
                                                                        "col"
                                                                    }
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      "Description"
                                                                    )
                                                                  ]
                                                                ),
                                                                _vm._v(" "),
                                                                _c(
                                                                  "th",
                                                                  {
                                                                    attrs: {
                                                                      scope:
                                                                        "col"
                                                                    }
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      "Type"
                                                                    )
                                                                  ]
                                                                )
                                                              ])
                                                            ]),
                                                            _vm._v(" "),
                                                            _c(
                                                              "tbody",
                                                              _vm._l(
                                                                response.headers,
                                                                function(
                                                                  header,
                                                                  headerName
                                                                ) {
                                                                  return _c(
                                                                    "tr",
                                                                    [
                                                                      _c("td", [
                                                                        _vm._v(
                                                                          _vm._s(
                                                                            headerName
                                                                          )
                                                                        )
                                                                      ]),
                                                                      _vm._v(
                                                                        " "
                                                                      ),
                                                                      _c("td", [
                                                                        _vm._v(
                                                                          _vm._s(
                                                                            header.description
                                                                          )
                                                                        )
                                                                      ]),
                                                                      _vm._v(
                                                                        " "
                                                                      ),
                                                                      _c("td", [
                                                                        _vm._v(
                                                                          _vm._s(
                                                                            header
                                                                              .schema
                                                                              .type
                                                                          )
                                                                        )
                                                                      ])
                                                                    ]
                                                                  )
                                                                }
                                                              ),
                                                              0
                                                            )
                                                          ]
                                                        )
                                                      ])
                                                    : _vm._e()
                                                ])
                                              ])
                                            }),
                                            0
                                          )
                                        ]
                                      )
                                    ])
                                  ],
                                  1
                                )
                              ],
                              1
                            )
                          }),
                          1
                        )
                      ])
                    ],
                    1
                  )
                ],
                1
              )
            }),
            1
          ),
          _vm._v(" "),
          _c("hr"),
          _vm._v(" "),
          _c("h2", [_vm._v("Schemas")]),
          _vm._v(" "),
          _c("br"),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "accordion", attrs: { role: "tablist" } },
            _vm._l(_vm.openapi.components.schemas, function(
              schema,
              schemaName
            ) {
              return _c(
                "b-card",
                {
                  key: schemaName,
                  staticClass: "mb-1",
                  attrs: { "no-body": "" }
                },
                [
                  _c(
                    "b-card-header",
                    {
                      directives: [
                        {
                          name: "b-toggle",
                          rawName: "v-b-toggle",
                          value: "accordionSchema" + schemaName,
                          expression: "`accordionSchema${schemaName}`"
                        }
                      ],
                      staticClass: "mb-0",
                      attrs: { "header-tag": "header", role: "tab" }
                    },
                    [
                      _c(
                        "b-button",
                        { attrs: { variant: "link", href: "#" } },
                        [_c("strong", [_vm._v(_vm._s(schemaName))])]
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "b-collapse",
                    {
                      attrs: {
                        id: "accordionSchema" + schemaName,
                        accordion: "accordion",
                        role: "tabpanel"
                      }
                    },
                    [
                      _c("b-card-body", [
                        _c("pre", { staticClass: "text-white bg-dark" }, [
                          _c("code", [
                            _vm._v(
                              "\n" +
                                _vm._s(schema.properties) +
                                "\n              "
                            )
                          ])
                        ])
                      ])
                    ],
                    1
                  )
                ],
                1
              )
            }),
            1
          )
        ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var component = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

function install(Vue) {
  if (install.installed) { return; }
  install.installed = true;
  Vue.component('vue-openapi-bootstrap', component);
}

var plugin = {
  install: install
};

var GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default component;
export { install };

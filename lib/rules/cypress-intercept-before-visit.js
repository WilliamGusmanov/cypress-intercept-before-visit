/**
 * @fileoverview checks that cypress intercept occurs before a visit
 * @author 
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "checks that cypress intercept occurs before a visit",
      category: 'Possible Errors'
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      unexpected: 'intercepts should occur before visits.'
    }
  },

  create(context) {
    function isTestBlock(callExpressionNodeCallee) {
      const { type, name } = callExpressionNodeCallee
      return type === 'Identifier' && name === 'it' || name  === 'test'
    }

    function isBeforeBlock(callExpressionNodeCallee) {
      const { type, name } = callExpressionNodeCallee
      return type === 'Identifier' && name === 'before'
    }

    function isBeforeEachBlock(callExpressionNodeCallee) {
      const { type, name } = callExpressionNodeCallee
      return type === 'Identifier' && name === 'beforeEach'
    }

    function isCyIntercept(memberExpressionNode) {
      const hasCy = memberExpressionNode.object && memberExpressionNode.object.name == 'cy';
      const hasIntercept = memberExpressionNode.property && memberExpressionNode.property.name == 'intercept';
      return hasCy && hasIntercept;
    }

    function isCyVisit(memberExpressionNode) {
      const hasCy = memberExpressionNode.object && memberExpressionNode.object.name == 'cy';
      const hasVisit = memberExpressionNode.property && memberExpressionNode.property.name == 'visit'
      return hasCy && hasVisit;
    }

    function checkAlias(callee) {
      if (callee && callee.property && callee.property.name == 'as') {
        return callee.object.callee;
      }
      return callee;
    }

    return {
      ExpressionStatement(node) {
        if (node.expression && node.expression.callee && (isTestBlock(node.expression.callee) || isBeforeBlock(node.expression.callee) || isBeforeEachBlock(node.expression.callee))) {
          const numOfArguments = node.expression.arguments.length;
          const statements = node.expression.arguments[numOfArguments - 1].body.body
          
          let visitFound = false
          
          statements.forEach(statement => {
            if (statement && statement.expression && statement.expression.callee) {
              const callee = checkAlias(statement.expression.callee);
              
              if (isCyIntercept(callee)) {
                if (visitFound) {
                  context.report({
                    node: statement,
                    messageId: 'unexpected',
                });
                }
              }
              if (isCyVisit(callee)) {
                visitFound = true;
              }
            }
          });     
        }
      }
    };
  },
};

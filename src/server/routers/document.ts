import { z } from 'zod'
import { procedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'

import { Redis } from '@upstash/redis'
import { TLStoreSnapshot } from 'tldraw'

const redis = Redis.fromEnv()

export const documentRouter = router({
  save: procedure
    .input(
      z.object({
        document: z.custom<TLStoreSnapshot>(
          (data) => {
            if (typeof data !== 'object' || data === null) {
              return false
            }

            return true
          },
          {
            message: 'Must be a valid TLStoreSnapshot'
          }
        )
      })
    )
    .mutation(async ({ input }) => {
      await redis.set('tldraw_document', input.document)
      return {
        success: true
      }
    }),
  load: procedure.query(async () => {
    try {
      const document = await redis.get('tldraw_document')

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Document not found'
        })
      }

      return {
        document
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve document',
        cause: error
      })
    }
  })
})
